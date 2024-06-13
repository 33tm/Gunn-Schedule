import { JSDOM } from "jsdom"
import type { Club, Staff } from "types"

const clubs: Club[] = []
const staff: Staff[] = []

const queue: Promise<any>[] = [
    fetch("https://www.gunnsec.org/active-club-list.html")
        .then(res => res.text())
        .then(async data => {
            const url = new JSDOM(data).window.document
                .getElementsByTagName("iframe")[0]
                .getAttribute("src")!
                .replace("pubhtml?widget=true&headers=false", "pub?output=tsv")
            await fetch(url)
                .then(res => res.text())
                .then(data => {
                    data.split("\n").slice(1).map(row => {
                        const [
                            status,
                            name,
                            type,
                            tier,
                            description,
                            day,
                            frequency,
                            time,
                            location,
                            president,
                            advisor,
                            email,
                            coadvisor,
                            coemail
                        ] = row.split("\t").map(value => value.trim())
                        clubs.push({
                            new: status !== "Returning",
                            name,
                            type,
                            tier: parseInt(tier.match(/\d+/)![0]),
                            description,
                            day,
                            frequency,
                            time,
                            location: location.replace(/([a-zA-Z])(?:[ -])?(?:0+)?(\d+)/, `${String.prototype.toUpperCase.apply("$1")}-$2`),
                            president,
                            advisor,
                            email,
                            ...(coadvisor ? { coadvisor, coemail } : {})
                        })
                    })
                })
        })
        .then(() => console.log("Fetched clubs"))
        .catch(() => console.error("Failed to fetch clubs")),
    fetch("https://gunn.pausd.org/connecting/staff-directory")
        .then(res => res.text())
        .then(data => {
            new JSDOM(data).window.document
                .querySelectorAll("tbody tr")
                .forEach(tr => {
                    const [name, department, phone] = [...tr.children].map(td => td.textContent?.trim()!)
                    staff.push({
                        name,
                        department,
                        email: tr.querySelector("a")?.getAttribute("href")?.replace(/^mailto:/, "") ?? null,
                        phone: phone ? `650-${phone.replace(/[ ,]/, "")}` : null
                    })
                })
        })
        .then(() => console.log("Fetched staff"))
        .catch(() => console.error("Failed to fetch staff"))
]

await Promise.all(queue)