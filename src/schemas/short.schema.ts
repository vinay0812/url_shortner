import z, { uuid } from "zod";

export const createUrlSchema = z.object({
    originalUrl: z.string().url('enter a valid url'),
    customShortCode: z.string()
        .min(4, 'Minimum 4 characters')
        .max(10, 'Maximum 10 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Only alphanumeric, underscore, and hyphen allowed')
        .optional(),

    expiresIn:z.string().regex(/^\d+[wdhms]$/,'use format like 2w, 7d, 30d, 1h, 15m').optional()
    // userID:uuid
})


export const updateUrlSchema = createUrlSchema.partial();


export type createShortUrl = z.infer<typeof createUrlSchema>