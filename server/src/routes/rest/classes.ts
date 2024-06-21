import { type Route, db, schoology } from "server"
import { verify } from "jsonwebtoken"

export const GET: Route = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.replace("Bearer ", "")
        const { uid } = verify(jwt!, process.env.JWT_SECRET!) as { uid: string }

        const classes = db
            .query("SELECT grade, periods, updated FROM classes WHERE uid = $uid")
            .get({ $uid: uid }) as { grade: number, periods: string, updated: string } | undefined

        if (classes && classes.updated === new Date().toDateString()) {
            return res.json({
                grade: classes.grade,
                periods: JSON.parse(classes.periods)
            })
        }

        const token = db
            .query("SELECT key, secret FROM schoology WHERE uid = $uid")
            .get({ $uid: uid }) as { key: string, secret: string } | undefined

        if (!token)
            return res.status(401).end()

        const courses = await schoology
            .request("GET", `/users/${uid}/sections`, token)
            .then(({ section }: {
                section: {
                    course_title: string
                    section_title: string
                    building_id: string
                    profile_url: string
                }[]
            }) => section
                .map(({
                    course_title,
                    section_title,
                    building_id,
                    profile_url
                }) => ({
                    course: course_title,
                    section: section_title,
                    building: building_id,
                    image: profile_url
                }))
                .filter(({ building }) => building === "7924989"))

        const grade = {
            "Freshman": 9,
            "Sophomore": 10,
            "Junior": 11,
            "Senior": 12
        }[courses.filter(({ course }) => course === "Gunn Student")[0].section.split(" ")[0]] || 0

        const periods: { course: string, teacher: string, image: string }[] = Array(8).fill(null)

        courses.forEach(({ course, section, image }) => {
            const [_, period, teacher] = section.match(/(\d) ([a-z]+)/i) || []
            periods[parseInt(period)] = { course, teacher, image }
        })

        db
            .query("INSERT OR REPLACE INTO classes (uid, grade, periods, updated) VALUES ($uid, $grade, $periods, $updated)")
            .run({ $uid: uid, $grade: grade, $periods: JSON.stringify(periods), $updated: new Date().toDateString() })

        return res.json({ grade, classes: periods })
    } catch {
        return res.status(401).end()
    }
}