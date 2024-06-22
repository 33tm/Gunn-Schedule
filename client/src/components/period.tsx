import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Credenza,
    CredenzaTrigger,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaDescription,
    CredenzaBody
} from "@/components/ui/credenza"

import type { Menu } from "shared/types"
import { NutritionFacts } from "./nutritionfacts"

export const Period = ({ period, start, end, time, menu }: {
    period: string,
    start: string,
    end: string,
    time?: Date,
    menu?: Menu
}) => {
    if (period === "Passing Period") return

    return (
        <div
            key={start}
            className="flex p-4 m-4 outline-dotted rounded-xl"
        >
            <div>
                <p className="font-bold">{period}</p>
                <p>{start} - {end}</p>
            </div>
            {menu && (period === "Lunch" || period === "Brunch") && (
                <Credenza>
                    <CredenzaTrigger asChild>
                        {
                            menu[period.toLowerCase() as unknown as keyof Menu].length
                            && <Button className="my-auto ml-auto">Menu</Button>
                        }
                    </CredenzaTrigger>
                    <CredenzaContent>
                        <CredenzaHeader>
                            <CredenzaTitle>{period} Menu</CredenzaTitle>
                            <CredenzaDescription>{time && format(time, "PPP")}</CredenzaDescription>
                        </CredenzaHeader>
                        <CredenzaBody className="rounded-xl space-y-2 mb-2 md:m-auto">
                            {menu[period.toLowerCase() as keyof Menu].map(item => {
                                if (!item) return
                                return (
                                    <Popover key={item.name}>
                                        <PopoverTrigger asChild>
                                            <Button className="w-full font-bold" variant="secondary">
                                                {item.name}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            {item.nutrition && <NutritionFacts nutrition={item.nutrition} serving={item.serving} />}
                                            {/* <p>{item.ingredients}</p> */}
                                        </PopoverContent>
                                    </Popover>
                                )
                            })}
                        </CredenzaBody>
                    </CredenzaContent>
                </Credenza>
            )
            }
        </div >
    )
}