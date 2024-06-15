import { JSDOM } from "jsdom"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import type { Club, Event, Staff } from "types"

const clubs = async () => {
    try {
        const spreadsheet = await JSDOM
            .fromURL("https://www.gunnsec.org/active-club-list.html")
            .then(({ window }) => window.frames[0].location.href
                .replace("pubhtml?widget=true&headers=false", "pub?output=tsv"))

        const clubs = await fetch(spreadsheet)
            .then(res => res.text())
            .then(tsv => tsv.split("\n").slice(1).map(row => {
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
            }))

        if (!existsSync("out/clubs.json") || JSON.stringify(clubs) !== JSON.stringify(require("out/clubs.json").clubs)) {
            console.log("Fetched new clubs")
            writeFileSync("out/clubs.json", JSON.stringify({ clubs, updated: Date.now() }))
        }
    } catch (error) {
        console.error("Failed to fetch clubs")
        console.error(error)
    }
}

const events = async () => {
    try {
        const calendars = await JSDOM
            .fromURL("https://gunn.pausd.org/campus-life/calendars")
            .then(({ window }) => window.document
                .querySelector("[data-calendar-ids]")
                ?.getAttribute("data-calendar-ids"))

        const ics = await JSDOM
            .fromURL(`https://gunn.pausd.org/cf_calendar/cms_calendar_feeds.cfm?calendar_ids=${calendars}`)
            .then(({ window }) => window.document
                .querySelector("[data-calendarid='all'] ul li:last-child a")
                ?.getAttribute("href")
                ?.replace("webcal", "https"))
            .then(ical => fetch(ical!).then(res => res.text()))

        const events = ics
            .split("BEGIN:VEVENT")
            .slice(1)
            .map(event => {
                const title = event.match(/SUMMARY:(.*)/)?.[1]
                const description = event.match(/DESCRIPTION:(.+)/)?.[1]
                const date = event.match(/DTSTART(?:(?::(\d{8})T(\d{6}))|(?:;VALUE=DATE:(\d{8})))/) || []
                const end = event.match(/DTEND(?::(\d{8})T(\d{6}))/)?.[1]
                return {
                    ...(title && { title }),
                    ...(description && { description }),
                    ...(date[1] ? {
                        date: date[1],
                        start: date[2],
                        ...(end && { end })
                    } : {
                        date: date[3]
                    })
                } as Event
            })

        if (!existsSync("out/events.json") || JSON.stringify(events) !== JSON.stringify(require("out/events.json").events)) {
            console.log("Fetched new events")
            writeFileSync("out/events.json", JSON.stringify({ events, updated: Date.now() }))
        }
    } catch (error) {
        console.error("Failed to fetch events")
        console.error(error)
    }
}

const staff = async () => {
    try {
        const staff = await JSDOM
            .fromURL("https://gunn.pausd.org/connecting/staff-directory")
            .then(({ window }) => [...window.document
                .querySelectorAll("tbody tr")]
                .map(tr => {
                    const [name, department, phone] = [...tr.children].map(td => td.textContent?.trim()!)
                    return {
                        name,
                        department,
                        email: tr.querySelector("a")?.getAttribute("href")?.replace(/^mailto:/, "").toLowerCase(),
                        ...(phone && { phone: `650-${phone.replace(/[ ,]/, "")}` })
                    } as Staff
                }))

        if (!existsSync("out/staff.json") || JSON.stringify(staff) !== JSON.stringify(require("out/staff.json").staff)) {
            console.log("Fetched new staff")
            writeFileSync("out/staff.json", JSON.stringify({ staff, updated: Date.now() }))
        }
    } catch (error) {
        console.error("Failed to fetch staff")
        console.error(error)
    }
}

export const scrape = async () => {
    if (!existsSync("out")) mkdirSync("out")
    await Promise.all([clubs(), events(), staff()])
}