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

import type { Menu as MenuType } from "shared/types"

export const Menu = ({ time, period, menu }: { time: Date, period: string, menu?: MenuType }) => {
    if (!menu) return
    const meal = period.toLowerCase() as keyof MenuType
    return (period === "Brunch" || period === "Lunch") && (
        <Credenza>
            <CredenzaTrigger asChild>
                {menu[meal].length && <Button className="my-auto ml-auto">Menu</Button>}
            </CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle>{period} Menu</CredenzaTitle>
                    <CredenzaDescription>{format(time, "PPP")}</CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className="rounded-xl space-y-2 mb-2 md:m-auto">
                    {menu[meal].map(item => {
                        if (!item) return
                        return (
                            <Popover key={item.name} modal>
                                <PopoverTrigger asChild>
                                    <Button className="w-full font-bold" variant="secondary">
                                        <p className="truncate">{item.name}</p>
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