import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { NutritionFacts } from "@/components/nutritionfacts"

import type { Menu } from "shared/types"

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
                                    <Popover key={item.name} modal>
                                        <PopoverTrigger asChild>
                                            <Button className="w-full font-bold" variant="secondary">
                                                {item.name}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <ScrollArea className="h-64">
                                                {item.nutrition && <NutritionFacts nutrition={item.nutrition} serving={item.serving} />}
                                                <Separator className="h-1.5" />
                                                <p className="font-black text-2xl">Ingredients</p>
                                                <Separator />
                                                <p>{item.ingredients.split(",").filter(Boolean)}</p>
                                            </ScrollArea>
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