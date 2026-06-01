import z from "zod";


export const createPostSchema = z.object({
    title: z.string().min(10).max(200),
    content: z.string().min(15).max(5000),
    published: z.boolean().default(false)
})

export const updatePostSchema = z.object({
    title: z.string().min(10).max(200).optional(),
    content: z.string().min(15).max(5000).optional(),
    published: z.boolean().optional()
})

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;


    