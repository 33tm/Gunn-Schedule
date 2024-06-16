import { JSDOM } from "jsdom"
import type { Event } from "types"

export const events = async () => {
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

    return ics
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
}