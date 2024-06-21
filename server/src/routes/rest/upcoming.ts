import { type Route, db, schoology } from "server"
import { verify } from "jsonwebtoken"

export const POST: Route = async (req, res) => {
    try {
        const { periods } = req.body
        if (!periods) return res.status(400).end()

        const jwt = req.headers.authorization?.replace("Bearer ", "")
        const { uid } = verify(jwt!, process.env.JWT_SECRET!) as { uid: string }

        const token = db
            .query("SELECT key, secret FROM schoology WHERE uid = $uid")
            .get({ $uid: uid }) as { key: string, secret: string } | undefined

        if (!token) return res.status(401).end()

        const upcoming = await schoology
            .request("POST", "/multiget", token, {
                request: periods.flatMap((period: string) => [
                    `/v1/sections/${period}/events?start=0&limit=200`,
                    `/v1/sections/${period}/assignments?start=0&limit=200`
                ])
            })
            .then(({ response }) => response.flatMap(({ body }: { body: object }) => Object.values(body)[0]))

        res.json(upcoming)
    } catch {
        res.status(401).end()
    }
}