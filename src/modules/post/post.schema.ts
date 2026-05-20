import z from "zod";


export const createPostSchema = z.object({
    title: z.string().min(10).max(200),
    content: z.string().min(20),
    published: z.boolean().default(false)
})

export const updatePostSchema = z.object({
    title: z.string().min(10).max(200).optional(),
    content: z.string().optional().min(20),
    published: z.boolean().optional()
})

export const deletePostSchema = z.object({
    id: z.string().uuid(),
    authorId: z.string().uuid()
});
