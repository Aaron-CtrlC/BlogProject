import z from "zod";


export const createUserSchema = z.object({
    email: z.email(),
    name: z.string().min(2),
    password: z.string().min(8).max(50)
})

export const getUserByIdSchema= z.object({
    email: z.email(),
    name: z.string(),
    password: z.string()
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


export const getIdUserSchema = z.object({
    id: z.number().int().positive(),
   
});

export const userResponseSchema = z.object({
    id: z.number(),
    email: z.email(),
    name: z.string().nullable(),
    password: z.string()
});

export const findAllUserSchema = z.object({
    users: z.array(userResponseSchema)
})