import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import type { User } from '../../generated/client/client.js';
import type { Prisma } from '../../generated/client/client.js';
import { NotFoundError } from '../../utils/errors.js';

export class UserService {
    async create(data: Pick<Prisma.UserCreateInput, 'email' | 'name' | 'password'>) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
            }
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: { id, deletedAt: null }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: { email, deletedAt: null }
        });
    }

    async findAll(): Promise<User[]> {
        return prisma.user.findMany({
            where: { deletedAt: null }
        });
    }

    async updateUser(id: string, data: Partial<Pick<Prisma.UserCreateInput, 'email' | 'name' | 'password'>>) {
        const existing = await prisma.user.findFirst({
            where: { id, deletedAt: null }
        });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        const updateData: Partial<Pick<Prisma.UserCreateInput, 'email' | 'name' | 'password'>> = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    async validatePassword(plainPassword: string, hashedPassword: string) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async deleteUser(id: string) {
        const existing = await prisma.user.findFirst({
            where: { id, deletedAt: null }
        });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        return prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}
    




