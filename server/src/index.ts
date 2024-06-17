import express, {
    json,
    type Request,
    type Response
} from "express"

import {
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
    writeFileSync
} from "fs"
import { createHash } from "crypto"

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
export const data = await import("out/data.json")
    .then(module => module.default)

export const menus = new Map<string, Menu>()

const rest = express()
    .use(json())

export type Route = (req: Request, res: Response) => void

const importRoutes = (root: string) => {
    readdirSync(root).forEach(file => {
        const path = `${root}/${file}`
        if (statSync(path).isDirectory()) return importRoutes(path)
        if (!file.endsWith(".ts")) return
        import(`./${path.slice(4, -3)}`).then(route => {
            const endpoint = path
                .slice(8, -3)
                .replace(/\[([^[\]]+)\]/g, ":$1")
                .replace(/\/index$/, "") || "/"
            Object.entries(route).forEach(([method, handler]) => {
                if (!(method.toLowerCase() in rest)) return
                rest[method.toLowerCase() as keyof typeof rest](endpoint, handler)
                console.log(`REST ${method} ${endpoint}`)
            })
        })
    })
}

importRoutes("src/rest")

rest.listen(443)