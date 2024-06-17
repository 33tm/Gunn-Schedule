import { type Route, data, menus } from "server"
import type { Nutrislice } from "types"

export const GET: Route = async (req, res) => {
    const { year, month, date } = req.params
    const datestring = `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")}`

    if (menus.has(datestring))
        return res.json(menus.get(datestring))

    const events = Object.values(data.events.data)
    const lowest = parseInt(events[0].date)
    const highest = parseInt(events[events.length - 1].date)
    const dateint = parseInt(`${year}${month.padStart(2, "0")}${date.padStart(2, "0")}`)

    if (dateint < lowest || dateint > highest)
        return res.status(400).end()

    const nutrislice = "https://pausd.api.nutrislice.com/menu/api/weeks/school/henry-m-gunn-hs/menu-type"

    const menu = await Promise.all([
        fetch(`${nutrislice}/breakfast/${year}/${month}/${date}?format=json`)
            .then(res => res.json()),
        fetch(`${nutrislice}/lunch/${year}/${month}/${date}?format=json`)
            .then(res => res.json())
    ]) as Nutrislice[]

    const [brunch, lunch] = menu.map(({ days }) => days
        .map(({ date, menu_items }) => {
            const menu = menu_items ? menu_items.map(({
                text,
                food,
                serving_size_amount,
                serving_size_unit
            }) => {
                if (text || !food) return null
                const { name, ingredients, rounded_nutrition_info } = food
                const nutrition = !Object.values(rounded_nutrition_info)
                    .every(value => value === null) ? rounded_nutrition_info : null
                const serving = `${serving_size_amount} ${serving_size_unit}`
                return {
                    name,
                    ingredients,
                    ...(nutrition && { nutrition }),
                    ...(serving !== "null null" && { serving })
                }
            }).filter(item => item) : []
            return { date, menu }
        }))

    if (!brunch.flatMap(({ menu }) => menu).length &&
        !lunch.flatMap(({ menu }) => menu).length &&
        new Date() < new Date(datestring))
        return res.status(404).end()

    brunch.forEach(({ date }, i) => {
        menus.set(date!, {
            brunch: brunch[i].menu,
            lunch: lunch[i].menu
        })
    })

    return res.json(menus.get(datestring))
}