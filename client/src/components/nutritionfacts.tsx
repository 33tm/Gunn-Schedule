import { Separator } from "@/components/ui/separator"
import type { Nutrition } from "shared/types"

export const NutritionFacts = ({ nutrition, serving }: { nutrition: Nutrition, serving?: string }) => {
    return (
        <>
            <p className="font-black text-2xl">Nutrition Facts</p>
            <Separator className={serving || "h-1.5"} />
            {serving && (
                <>
                    <div className="flex font-bold">
                        <p>Serving size</p>
                        <p className="ml-auto">{serving}</p>
                    </div>
                    <Separator className="h-1.5" />
                </>
            )}
            <div className="flex font-black text-2xl">
                <p>Calories</p>
                <p className="ml-auto">{nutrition.calories}</p>
            </div>
            <Separator className="h-1" />
            <div className="flex">
                <p className="ml-auto font-bold">% Daily Value</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Total Fat</p>
                <p className="pl-1">{nutrition.g_fat}g</p>
                <p className="ml-auto font-bold">{nutrition.g_fat && Math.round(nutrition.g_fat / 78 * 100)}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="pl-4">Saturated Fat</p>
                <p className="pl-1">{nutrition.g_saturated_fat}g</p>
                <p className="ml-auto font-bold">{nutrition.g_saturated_fat && Math.round(nutrition.g_saturated_fat / 20 * 100)}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="pl-4">Trans Fat</p>
                <p className="pl-1">{nutrition.g_trans_fat}g</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Cholesterol</p>
                <p className="pl-1">{nutrition.mg_cholesterol}mg</p>
                <p className="ml-auto font-bold">{nutrition.mg_cholesterol && Math.round(nutrition.mg_cholesterol / 300 * 100) || 0}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Sodium</p>
                <p className="pl-1">{nutrition.mg_sodium}mg</p>
                <p className="ml-auto font-bold">{nutrition.mg_sodium && Math.round(nutrition.mg_sodium / 2300 * 100)}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Total Carbohydrate</p>
                <p className="pl-1">{nutrition.g_carbs}g</p>
                <p className="ml-auto font-bold">{nutrition.g_carbs && Math.round(nutrition.g_carbs / 275 * 100)}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="pl-4">Dietary Fiber</p>
                <p className="pl-1">{nutrition.g_fiber}g</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="pl-4">Total Sugars</p>
                <p className="pl-1">{nutrition.g_sugar}g</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="pl-8">Incl. {nutrition.g_added_sugar}g Added Sugars</p>
                <p className="ml-auto font-bold">{nutrition.g_sugar && Math.round(nutrition.g_sugar / 50 * 100)}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Protein</p>
                <p className="pl-1">{nutrition.g_protein}g</p>
            </div>
            <Separator className="h-1.5" />
            <div className="flex">
                <p className="font-bold">Vitamin D</p>
                <p className="pl-1">{nutrition.mcg_vitamin_d || 0}mcg</p>
                <p className="ml-auto font-bold">{nutrition.mcg_vitamin_d && Math.round(nutrition.mcg_vitamin_d / 20 * 100) || 0}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Calcium</p>
                <p className="pl-1">{nutrition.mg_calcium || 0}mg</p>
                <p className="ml-auto font-bold">{nutrition.mg_calcium && Math.round(nutrition.mg_calcium / 1300 * 100) || 0}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Iron</p>
                <p className="pl-1">{nutrition.mg_iron || 0}mg</p>
                <p className="ml-auto font-bold">{nutrition.mg_iron && Math.round(nutrition.mg_iron / 18 * 100) || 0}%</p>
            </div>
            <Separator />
            <div className="flex">
                <p className="font-bold">Potassium</p>
                <p className="pl-1">{nutrition.mg_potassium || 0}mg</p>
                <p className="ml-auto font-bold">{nutrition.mg_potassium && Math.round(nutrition.mg_potassium / 4700 * 100) || 0}%</p>
            </div>
        </>
    )
}