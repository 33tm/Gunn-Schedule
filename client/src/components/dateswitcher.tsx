import { format } from "date-fns"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const DateSwitcher = ({ date, setDate }: { date: Date, setDate: (date: Date) => void }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex">
            <Button
                size="icon"
                className="rounded-r-none"
                onClick={() => setDate(new Date(+date - (1000 * 60 * 60 * 24)))}
            >
                <ChevronLeft />
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button className="w-48 rounded-none">
                        {format(date, "PPP")}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        initialFocus
                        mode="single"
                        selected={date}
                        onSelect={date => {
                            if (date) setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
            <Button
                size="icon"
                className="rounded-l-none"
                onClick={() => setDate(new Date(+date + (1000 * 60 * 60 * 24)))}
            >
                <ChevronRight />
            </Button>
        </div>
    )
}