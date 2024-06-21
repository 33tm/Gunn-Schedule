import { type Route, db, schoology } from "server"
import { verify } from "jsonwebtoken"
import { Period } from "types"

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
                    id: string
                    course_title: string
                    section_title: string
                    building_id: string
                    profile_url: string
                }[]
            }) => section
                .map(({
                    id,
                    course_title,
                    section_title,
                    building_id,
                    profile_url
                }) => ({
                    id,
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

        const periods: { id: string, course: string, teacher: string, image: string }[] = Array(Object.keys(Period).length / 2).fill(null)

        courses.forEach(({ id, course, section, image }) => {
            periods[{
                "Gunn Student": Period.GRADE,
                "Gunn Library": Period.LIBRARY,
                "SELF": Period.SELF,
                "Study Hall": Period.STUDYHALL
            }[course] || -1] = { id, course, teacher: "", image }
            const [_, period, teacher] = section.match(/(\d) ([a-z]+)/i) || []
            periods[parseInt(period)] = { id, course, teacher, image }
        })

        db
            .query("INSERT OR REPLACE INTO classes (uid, grade, periods, updated) VALUES ($uid, $grade, $periods, $updated)")
            .run({ $uid: uid, $grade: grade, $periods: JSON.stringify(periods), $updated: new Date().toDateString() })

        return res.json({ grade, classes: periods })
    } catch {
        return res.status(401).end()
    }
}