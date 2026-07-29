import { Request } from 'express'

export function getUser(req: Request) {
    const user = req.user
    if (!user) {
        throw new Error('Unauthorized')
    }
    return user
}

export function getShortCode(req: Request): string {
    const shortcode = req.params.shortcode
    if (typeof shortcode === 'string') return shortcode
    return shortcode?.[0] || ''
}