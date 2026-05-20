import { prisma } from '../../config/prisma.js';
import type { Post } from '../../generated/client/client.js';
import type { Prisma } from '../../generated/client/client.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';

export class PostService {
    async createPost(data: Pick<Prisma.PostUncheckedCreateInput, 'title' | 'content' | 'published'>, authorId: string): Promise<Post> {
        return prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                published: data.published ?? false,
                authorId
            }
        });
    }

    async updatePostById(id: string, data: Partial<Pick<Prisma.PostUncheckedUpdateInput, 'title' | 'content' | 'published'>>, authorId: string): Promise<Post> {
        const existing = await prisma.post.findFirst({
            where: { id, deletedAt: null }
        });

        if (!existing) {
            throw new NotFoundError('Post no encontrado');
        }
        if (existing.authorId !== authorId) {
            throw new ForbiddenError('No puedes modificar un post que no te pertenece');
        }

        const updateData: Partial<Pick<Prisma.PostUncheckedUpdateInput, 'title' | 'content' | 'published'>> = {
            title: data.title,
            content: data.content,
            published: data.published,
        };

        return prisma.post.update({
            where: { id },
            data: updateData
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



