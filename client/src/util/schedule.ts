import { differenceInWeeks, format } from "date-fns"
import { Period } from "shared/enums"

export const getSchedule = (date: Date, periods: string[], grade?: number) => {
    const tortureMethod = (grade?: number) => {
        const offset = differenceInWeeks(date, new Date("2024-08-16")) % 2 === 0
        if (grade === 9 || grade === 10) return offset ? periods[Period.SELF] : periods[Period.STUDYHALL]
        if (grade === 11 || grade === 12) return offset ? periods[Period.STUDYHALL] : periods[Period.SELF]
        return "SELF/Study Hall"
    }
    return {
        "Monday": [
            periods[Period.P0] && [periods[Period.P0], "07:55", "08:50"],
            periods[Period.P0] && ["Passing Period", "08:50", "09:00"],
            [periods[Period.P1], "09:00", "09:45"],
            ["Passing Period", "09:45", "09:55"],
            [periods[Period.P2], "09:55", "10:40"],
            ["Brunch", "10:40", "10:45"],
            ["Passing Period", "10:45", "10:55"],
            [periods[Period.P3], "10:55", "11:40"],
            ["Passing Period", "11:40", "11:50"],
            [periods[Period.P4], "11:50", "12:35"],
            ["Lunch", "12:35", "13:05"],
            ["Passing Period", "13:05", "13:15"],
            [periods[Period.P5], "13:15", "14:00"],
            ["Passing Period", "14:00", "14:10"],
            [periods[Period.P6], "14:10", "14:55"],
            ["Passing Period", "14:55", "15:05"],
            [periods[Period.P7], "15:05", "15:50"],
            periods[Period.P8] && ["Passing Period", "15:50", "6:00"],
            periods[Period.P8] && [periods[Period.P8], "16:00", "16:45"]
        ],
        "Tuesday": [
            periods[Period.P0] && [periods[Period.P0], "07:55", "08:50"],
            periods[Period.P0] && ["Passing Period", "08:50", "09:00"],
            [periods[Period.P1], "09:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P2], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "13:00"],
            [periods[Period.P3], "13:00", "14:30"],
            ["Passing Period", "14:30", "14:40"],
            [periods[Period.P4], "14:40", "16:10"],
            periods[Period.P8] && ["Passing Period", "16:10", "16:20"],
            periods[Period.P8] && [periods[Period.P8], "16:20", "17:50"]
        ],
        "Wednesday": [
            periods[Period.P0] && [periods[Period.P0], "07:55", "08:50"],
            periods[Period.P0] && ["Passing Period", "08:50", "09:00"],
            [periods[Period.P5], "09:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P6], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "13:00"],
            [periods[Period.P7], "13:00", "14:30"],
            ["Passing Period", "14:30", "14:40"],
            ["PRIME", "14:40", "15:30"]
        ],
        "Thursday": [
            periods[Period.P0] && [periods[Period.P0], "07:55", "08:50"],
            periods[Period.P0] && ["Passing Period", "08:50", "09:00"],
            [periods[Period.P1], "09:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P2], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "13:00"],
            [periods[Period.P3], "13:00", "14:30"],
            ["Passing Period", "14:30", "14:40"],
            [periods[Period.P4], "14:40", "16:10"],
            periods[Period.P8] && ["Passing Period", "16:10", "16:20"],
            periods[Period.P8] && [periods[Period.P8], "16:20", "17:50"]
        ],
        "Friday": [
            [periods[Period.P5], "09:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P6], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "13:00"],
            [tortureMethod(grade), "13:00", "13:50"],
            ["Passing Period", "13:50", "14:00"],
            [periods[Period.P7], "14:00", "15:30"]
        ]
    }[format(date, "EEEE")] || []
}