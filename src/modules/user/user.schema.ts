import z from "zod";


export const createUserSchema = z.object({
    email: z.email(),
    name: z.string().min(2),
    password: z.string().min(8).max(50)
})


export const updateUserSchema = z.object({
    email: z.email().optional(),
    name: z.string().min(2).optional(),
    password: z.string().min(8).max(50).optional()

})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(50)
})


export const userResponseSchema = z.object({
    email: z.email(),
    name: z.string().nullable(),
});

export const findAllUserSchema = z.object({
    users: z.array(userResponseSchema)
})