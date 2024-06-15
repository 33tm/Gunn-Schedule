import { readdir } from "fs/promises"
import { scrape } from "./scrape"

await scrape()

const files = await readdir("out")

console.log(
    files.map(file => {
        const { updated } = require(`out/${file}`)
        return { resource: file.slice(0, -5), updated }
    })
)