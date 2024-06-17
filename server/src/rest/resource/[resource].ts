import { type Route, data } from "server"

export const POST: Route = (req, res) => {
    const { hash } = req.body
    const { resource } = req.params

    if (!hash)
        return res.status(400).end()

    if (!data[resource as keyof typeof data])
        return res.status(404).end()

    if (data[resource as keyof typeof data].hash === hash!)
        return res.status(304).end()

    res.json(data[resource as keyof typeof data])
}