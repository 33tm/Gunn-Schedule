import { createHash } from "crypto"
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs"

if (!existsSync("out")) mkdirSync("out")

const scrapers = await Promise.all(readdirSync("src/scrape")
    .map(async file => await import(`./scrape/${file}`)
        .then(module => module[file.slice(0, -3)])))

await Promise.all(scrapers.map(scraper => scraper()))
    .then(res => res.map(data => ({ data, hash: createHash("sha1").update(JSON.stringify(data)).digest("hex") })))
    .then(res => res.reduce((acc, curr, i) => ({ ...acc, [scrapers[i].name]: curr }), {}))
    .then(res => writeFileSync("out/data.json", JSON.stringify(res)))

export const { clubs, events, staff } = require("out/data.json")

console.log(clubs.hash, events.hash, staff.hash)