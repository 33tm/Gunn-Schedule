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
            periods[Period.P0] && [periods[Period.P0], "7:55", "8:50"],
            periods[Period.P0] && ["Passing Period", "8:50", "9:00"],
            [periods[Period.P1], "9:00", "9:45"],
            ["Passing Period", "9:45", "9:55"],
            [periods[Period.P2], "9:55", "10:40"],
            ["Brunch", "10:40", "10:45"],
            ["Passing Period", "10:45", "10:55"],
            [periods[Period.P3], "10:55", "11:40"],
            ["Passing Period", "11:40", "11:50"],
            [periods[Period.P4], "11:50", "12:35"],
            ["Lunch", "12:35", "1:05"],
            ["Passing Period", "1:05", "1:15"],
            [periods[Period.P5], "1:15", "2:00"],
            ["Passing Period", "2:00", "2:10"],
            [periods[Period.P6], "2:10", "2:55"],
            ["Passing Period", "2:55", "3:05"],
            [periods[Period.P7], "3:05", "4:50"],
            periods[Period.P8] && ["Passing Period", "3:50", "4:00"],
            periods[Period.P8] && [periods[Period.P8], "4:00", "4:45"]
        ],
        "Tuesday": [
            periods[Period.P0] && [periods[Period.P0], "7:55", "8:50"],
            periods[Period.P0] && ["Passing Period", "8:50", "9:00"],
            [periods[Period.P1], "9:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P2], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "1:00"],
            [periods[Period.P3], "1:00", "2:30"],
            ["Passing Period", "2:30", "2:40"],
            [periods[Period.P4], "2:40", "4:10"],
            periods[Period.P8] && ["Passing Period", "4:10", "4:20"],
            periods[Period.P8] && [periods[Period.P8], "4:20", "5:50"]
        ],
        "Wednesday": [
            periods[Period.P0] && [periods[Period.P0], "7:55", "8:50"],
            periods[Period.P0] && ["Passing Period", "8:50", "9:00"],
            [periods[Period.P5], "9:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P6], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "1:00"],
            [periods[Period.P7], "1:00", "2:30"],
            ["Passing Period", "2:30", "2:40"],
            ["PRIME", "2:40", "3:30"]
        ],
        "Thursday": [
            periods[Period.P0] && [periods[Period.P0], "7:55", "8:50"],
            periods[Period.P0] && ["Passing Period", "8:50", "9:00"],
            [periods[Period.P1], "9:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P2], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "1:00"],
            [periods[Period.P3], "1:00", "2:30"],
            ["Passing Period", "2:30", "2:40"],
            [periods[Period.P4], "2:40", "4:10"],
            periods[Period.P8] && ["Passing Period", "4:10", "4:20"],
            periods[Period.P8] && [periods[Period.P8], "4:20", "5:50"]
        ],
        "Friday": [
            [periods[Period.P5], "9:00", "10:35"],
            ["Brunch", "10:35", "10:40"],
            ["Passing Period", "10:40", "10:50"],
            [periods[Period.P6], "10:50", "12:20"],
            ["Lunch", "12:20", "12:50"],
            ["Passing Period", "12:50", "1:00"],
            [tortureMethod(grade), "1:00", "1:50"],
            ["Passing Period", "1:50", "2:00"],
            [periods[Period.P7], "2:00", "3:30"]
        ]
    }[format(date, "EEEE")] || []
}