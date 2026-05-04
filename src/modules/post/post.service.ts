import { prisma } from '../../config/prisma.js';
import type { CreatePostDTO, Post, UpdatePostDTO } from '../../types/post.types.js';



export class PostService {
    async createPost(data: CreatePostDTO, authorId: string): Promise<Post> {

        const createData: CreatePostDTO = {
            title: data.title,
            content: data.content,
            published: data.published,
            authorId: authorId
        }

        const createUser = await prisma.post.create({ data: { ...createData, authorId: authorId } })

        return createUser;
    }

    async updatePostById(id: number, data: any, authorId: string): Promise<Post> {
        const updateData: UpdatePostDTO = {
            title: data.title,
            content: data.content,
            published: data.published,
        }

        const updateUser = await prisma.post.update({ where: { id: id, deletedAt: null, authorId: authorId }, data: updateData })
        return updateUser;

    }

    async deletePost(id: number, authorId: string): Promise<Post> {
        const postUpdate: Post = await prisma.post.update({
            where: { id: id, deletedAt: null, authorId: authorId },
            data: { deletedAt: new Date() }
        })
 
        return postUpdate;
    }



    async findById(postId: number): Promise<Post | null> {
        const searchPostId = prisma.post.findFirst({ where: { id: postId, deletedAt: null } })
        const post = await searchPostId;
        return post;

    }

    async findAll(authorId?: string): Promise<Post[]> {
        const postList: Post[] = await prisma.post.findMany({
            where: {
                deletedAt: null,
                ...(authorId && { authorId })
            }
        })

        return postList;
    }



}



