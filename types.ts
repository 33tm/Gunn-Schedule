export enum Period {
    P0 = 0,
    P1 = 1,
    P2 = 2,
    P3 = 3,
    P4 = 4,
    P5 = 5,
    P6 = 6,
    P7 = 7,
    P8 = 8,
    SELF = 9,
    STUDYHALL = 10,
    GRADE = 11,
    LIBRARY = 12
}

export type Menu = {
    brunch: (Item | null)[]
    lunch: (Item | null)[]
}

export interface Item {
    name: string
    ingredients: string
    nutrition?: Nutrition
    serving?: string
}

interface Nutrition {
    calories: number | null
    g_fat: number | null
    g_sat_fat: number | null
    g_saturated_fat: number | null,
    g_trans_fat: number | null,
    mg_cholesterol: number | null,
    g_carbs: number | null,
    g_added_sugar: number | null,
    g_sugar: number | null,
    mg_potassium: number | null,
    mg_sodium: number | null,
    g_fiber: number | null,
    g_protein: number | null,
    mg_iron: number | null,
    mg_calcium: number | null,
    mg_vitamin_c: number | null,
    iu_vitamin_a: number | null,
    re_vitamin_a: number | null,
    mcg_vitamin_a: number | null,
    mg_vitamin_d: number | null,
    mcg_vitamin_d: number | null
}

export interface Nutrislice {
    days: {
        date: string
        menu_items: {
            text: string
            food: {
                name: string
                ingredients: string
                rounded_nutrition_info: Nutrition
            }
            serving_size_amount: string
            serving_size_unit: string
        }[]
    }[]
}

export interface Event {
    title?: string
    description?: string
    date?: string
    start?: string
    end?: string
}

export interface Club {
    new: boolean
    name: string
    type: string
    tier: number
    description: string
    day: string
    frequency: string
    time: string
    location: string
    president: string
    advisor: string
    email: string
    coadvisor?: string
    coemail?: string
}

export interface Staff {
    name: string
    department: string
    email?: string
    phone?: string
}