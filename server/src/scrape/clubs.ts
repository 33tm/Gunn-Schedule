import { JSDOM } from "jsdom"
import type { Club } from "types"

export const clubs = async () => {
    const tsv = await JSDOM
        .fromURL("https://www.gunnsec.org/active-club-list.html")
        .then(({ window }) => window.frames[0].location.href
            .replace("pubhtml?widget=true&headers=false", "pub?output=tsv"))
        .then(fetch)
        .then(res => res.text())

    return tsv.split("\n").slice(1).map(row => {
        const [status, name, type, tier, description, day, frequency, time, location, president, advisor, email, coadvisor, coemail] = row
            .split("\t")
            .map(value => value.trim())
        return {
            new: status !== "Returning",
            name,
            type,
            tier: parseInt(tier.match(/\d+/)![0]),
            description,
            day,
            frequency,
            time,
            location: location.replace(/([a-z])(?:[-\s]*)(?:0+)?(\d+)/gi,
                (_, building, room) => `${building.toUpperCase()}-${room}`),
            president,
            advisor,
            email,
            ...(coadvisor && { coadvisor, coemail })
        } as Club
    })
}