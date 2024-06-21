import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs"
import { createServer } from "http"
import { createHash } from "crypto"
import { Database } from "bun:sqlite"
import { dirname } from "path"

import express, { json, type Request, type Response } from "express"
import { Server, type Socket, type Namespace } from "socket.io"
import cors from "cors"

import type { Menu } from "types"

if (!existsSync("out")) mkdirSync("out")

const scrapers = await Promise.all(readdirSync("src/scrape")
    .map(async file => await import(`./scrape/${file}`)
        .then(module => module[file.slice(0, -3)])))

await Promise.all(scrapers.map(scraper => scraper()))
    .then(res => res.map(data => ({ data, hash: createHash("sha1").update(JSON.stringify(data)).digest("hex") })))
    .then(res => res.reduce((acc, curr, i) => ({ ...acc, [scrapers[i].name]: curr }), {}))
    .then(res => writeFileSync("out/data.json", JSON.stringify(res)))

// @ts-ignore
export const { default: data } = await import("out/data.json")
export const db = new Database("db.sqlite", { create: true })
export const menus = new Map<string, Menu>()

const config = { origin: "*" }

const rest = express().use(json(), cors(config))
const server = createServer(rest)
const socket = new Server(server, { cors: config })

export type Route = (req: Request, res: Response) => void
export type Handler = (server: Namespace, socket: Socket, data: any) => void

const routes = (root: string) => {
    readdirSync(root).forEach(file => {
        const path = `${root}/${file}`
        if (statSync(path).isDirectory()) return routes(path)
        if (!file.endsWith(".ts")) return
        import(`./${path.slice(4, -3)}`).then(route => {
            const endpoint = path
                .slice(15, -3)
                .replace(/\[([^[\]]+)\]/g, ":$1")
                .replace(/\/index$/, "") || "/"
            Object.entries(route).forEach(([method, handler]) => {
                if (!(method.toLowerCase() in rest)) return
                rest[method.toLowerCase() as keyof typeof rest](endpoint, handler)
                console.log(`${method} ${endpoint}`)
            })
        })
    })
}

routes("src/routes/rest")

const events = async (root: string) => {
    readdirSync(root).forEach(file => {
        const path = `${root}/${file}`
        if (statSync(path).isDirectory()) return events(path)
        if (!file.endsWith(".ts")) return
        import(`./${path.slice(4, -3)}`).then(({ handler }) => {
            if (!handler) return
            const namespace = socket.of(`/${dirname(path).slice(11)}`)
            namespace.on("connection", connection => {
                connection.on(file.slice(0, -3), data => {
                    handler(namespace, connection, data)
                })
            })
            console.log(`Socket ${namespace.name} [${file.slice(0, -3)}]`)
        })
    })
}

events("src/routes/socket")

server.listen(443)