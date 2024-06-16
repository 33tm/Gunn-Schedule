import type { Request, Response } from "express"

export type Route = (req: Request, res: Response) => void

export interface Event {
    title?: string,
    description?: string,
    date?: string,
    start?: string,
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