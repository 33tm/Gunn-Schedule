"use client"

import { format } from "date-fns"
import { useEffect, useState } from "react"
import { getSchedule } from "@/util/schedule"
import { Period } from "@/components/period"

import type { Menu } from "shared/types"

export const Periods = ({ date, time }: { date: Date, time: Date }) => {
    const [menu, setMenu] = useState<Menu>()
    const [schedule, setSchedule] = useState<[string, string, string][]>()
    const [periods, setPeriods] = useState<string[]>([
        "Period 0",
        "Period 1",
        "Period 2",
        "Period 3",
        "Period 4",
        "Period 5",
        "Period 6",
        "Period 7",
        "Period 8",
        "SELF",
        "Study Hall"
    ])

    const grade = 9

    useEffect(() => {
        setSchedule(getSchedule(date, periods, grade) as [string, string, string][])
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${format(date, "yyyy-MM-dd")}`)
            .then(res => res.json())
            .catch(() => null)
            .then(setMenu)
    }, [date])

    return (
        <div>
            {schedule?.map(([period, start, end]) => (
                <Period
                    key={start}
                    period={period}
                    start={start}
                    end={end}
                    date={date}
                    time={time}
                    menu={menu}
                />
            ))}
        </div>
    )
}