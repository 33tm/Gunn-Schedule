export interface Club {
    new: boolean
    name: string
    type: string
    tier: number
    description: string
    day: string
    extra?: string
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
    email: string | null
    phone: string | null
}