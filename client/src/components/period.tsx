import { compareAsc, compareDesc, format, formatDistanceToNowStrict } from "date-fns"

import { Menu } from "@/components/menu"

import type { Menu as MenuType } from "shared/types"

export const Period = ({ period, start, end, date, time, menu }: {
    period: string,
    start: string,
    end: string,
    date: Date,
    time: Date,
    menu?: MenuType
}) => {
    if (period === "Passing Period") return

    const started = new Date(`${format(date, "yyyy-MM-dd")}T${start}`)
    const ended = new Date(`${format(date, "yyyy-MM-dd")}T${end}`)

    const beforeStart = !!(compareDesc(time, started) + 1)
    const afterEnd = !!(compareAsc(time, ended) + 1)

    const state = {
        before: beforeStart && !afterEnd,
        during: !beforeStart && !afterEnd,
        after: afterEnd && !beforeStart
    }

    return (
        <div
            key={start}
            className="flex p-4 m-4 outline-dotted rounded-xl"
        >
            <div>
                <p className="font-bold">{period}</p>
                <p>{format(started, "p")} - {format(ended.toISOString(), "p")}</p>
                {state.before && (
                    <p>Starting in {formatDistanceToNowStrict(started)}</p>
                )}
                {state.during && (
                    <></>
                )}
                {state.after && (
                    <p>Ended {formatDistanceToNowStrict(ended)} ago</p>
                )}
            </div>
            <Menu time={time} period={period} menu={menu} />
        </div >
    )
}