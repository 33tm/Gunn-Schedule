import { type Route, schoology, tokens, db } from "server"
import { sign } from "jsonwebtoken"

export const POST: Route = async (req, res) => {
    const { id, key } = req.body

    if (!tokens.has(id))
        return res.status(401).end()

    const { secret } = tokens.get(id)!

    const token = await schoology
        .request("GET", "/oauth/access_token", { key, secret })
        .then(schoology.format)
        .catch(() => null)

    if (!token)
        return res.status(401).end()

    const { api_uid: uid } = await schoology
        .request("GET", "/app-user-info", token)

    if (!uid)
        return res.status(500).end()

    const { building_id: bid, username } = await schoology
        .request("GET", `/users/${uid}`, token)

    if (bid !== 7924989 || !username.match(/950\d{5}/))
        return res.status(403).end()

    db
        .query("INSERT OR IGNORE INTO schoology (uid, key, secret) VALUES ($uid, $key, $secret)")
        .run({ $uid: uid, $key: token.key, $secret: token.secret })

    const jwt = sign({ uid, id: username }, process.env.JWT_SECRET!)

    res.json({ jwt })
}