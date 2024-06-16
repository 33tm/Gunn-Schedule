import { data } from "server"
import type { Route } from "types"

export const POST: Route = (req, res) => {
    const { hash } = req.body
    const { resource } = req.params

    if (!hash)
        return res.status(400).end()

    if (!data[resource])
        return res.status(404).end()

    if (data[resource].hash === hash!)
        return res.status(304).end()

    res.json(data[resource])
}