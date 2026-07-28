import z from "zod";

export const userSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6, 'password should be minimum 6 character long')
})

// export const loginUserSchema = userSchema.omit({
//     name: true
// })

export type createUserInput = z.infer<typeof userSchema>

// export type loginUserInput = z.infer<typeof loginUserSchema>

