import { type Route, schoology, tokens, db, socket } from "server"
import { sign } from "jsonwebtoken"

export const POST: Route = async (req, res) => {
    const { id, key } = req.body

    if (!tokens.has(id)) return res.status(401).end()

    const { secret } = tokens.get(id)!

    const token = await schoology
        .request("GET", "/oauth/access_token", { key, secret })
        .then(schoology.format)
        .catch(() => null)

    if (!token) return res.status(401).end()

    const { api_uid: uid } = await schoology
        .request("GET", "/app-user-info", token)

    if (!uid) return res.status(500).end()

    const user = db
        .query("SELECT * FROM users WHERE uid = $uid")
        .get({ $uid: uid })

    if (!user) {
        const { building_id: bid, name_display: name, username } = await schoology
            .request("GET", `/users/${uid}`, token)

        if (bid !== 7924989) return res.status(403).end()

        const courses = await schoology
            .request("GET", `/users/${uid}/sections`, token)
            .then(({ section }: {
                section: {
                    course_title: string
                    section_title: string
                    profile_url: string
                }[]
            }) => section.map(({
                course_title,
                section_title,
                profile_url
            }) => ({
                course: course_title,
                section: section_title,
                image: profile_url
            })))

        db
            .query("INSERT INTO users (uid, id) VALUES ($uid, $id)")
            .run({
                $uid: uid,
                $id: username
            })
    }

    const jwt = sign({ uid }, process.env.JWT_SECRET!)

    socket.of("/auth").to(id).emit("jwt", jwt)

    res.end()
}