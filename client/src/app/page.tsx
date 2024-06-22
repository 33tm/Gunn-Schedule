"use client"

import { format } from "date-fns"
import { useEffect, useState } from "react"

import { Periods } from "@/components/periods"
import { DateSwitcher } from "@/components/dateswitcher"

export default () => {
    const [time, setTime] = useState(new Date())
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <p suppressHydrationWarning>{time && format(time, "pp")}</p>
            <DateSwitcher date={date} setDate={setDate} />
            <Periods date={date} time={time} />
        </>
    )
}