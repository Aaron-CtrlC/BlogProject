import { prisma } from '../../config/prisma.js';
import type { Post } from '../../generated/client/client.js';
import type { CreatePostInput, UpdatePostInput } from './post.schema.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';

export class PostService {
    async createPost(data: CreatePostInput, authorId: string): Promise<Post> {
        return prisma.post.create({
            data: {
                ...data,
                authorId
            }
        });
    }

    async updatePostById(id: string, data: UpdatePostInput, authorId: string): Promise<Post> {
        const existing = await prisma.post.findFirst({
            where: { id, deletedAt: null }
        });

        if (!existing) {
            throw new NotFoundError('Post no encontrado');
        }
        if (existing.authorId !== authorId) {
            throw new ForbiddenError('No puedes modificar un post que no te pertenece');
        }

        return prisma.post.update({
            where: { id },
            data: { ...data }
        });
    }

    async deletePost(id: string, authorId: string): Promise<Post> {
        const existing = await prisma.post.findFirst({
            where: { id, deletedAt: null }
        });

        if (!existing) {
            throw new NotFoundError('Post no encontrado');
        }
        if (existing.authorId !== authorId) {
            throw new ForbiddenError('No puedes eliminar un post que no te pertenece');
        }

        return prisma.post.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

    async findById(postId: string): Promise<Post | null> {
        return prisma.post.findFirst({ where: { id: postId, deletedAt: null } });
    }

    async findAll(authorId?: string): Promise<Post[]> {
        return prisma.post.findMany({
            where: {
                deletedAt: null,
                ...(authorId && { authorId })
            }
        });
    }
}



