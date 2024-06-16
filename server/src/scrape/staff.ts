import { JSDOM } from "jsdom"
import type { Staff } from "types"

export const staff = async () => {
    const rows = await JSDOM
        .fromURL("https://gunn.pausd.org/connecting/staff-directory")
        .then(({ window }) => [...window.document.querySelectorAll("tbody tr")])

    return rows.map(row => {
        const [name, department, phone] = [...row.children].map(td => td.textContent?.trim()!)
        return {
            name,
            department,
            email: row.querySelector("a")?.getAttribute("href")?.replace(/^mailto:/, "").toLowerCase(),
            ...(phone && { phone: `650-${phone.replace(/[ ,]/, "")}` })
        } as Staff
    })
}