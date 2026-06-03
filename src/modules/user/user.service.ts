import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import type { User } from '../../generated/client/client.js';
import type { CreateUserInput, UpdateUserInput } from './user.schema.js';
import { NotFoundError } from '../../utils/errors.js';

export class UserService {
    async createUser(data: CreateUserInput) {
        return prisma.user.create({
            data: {
                ...data,
                password: await bcrypt.hash(data.password, 10),
            }
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: { id, deletedAt: null }
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: { email, deletedAt: null }
        });
    }

    async findAllUsers(): Promise<User[]> {
        return prisma.user.findMany({
            where: { deletedAt: null }
        });
    }

    async updateUser(id: string, data: UpdateUserInput) {
        const existing = await prisma.user.findFirst({
            where: { id, deletedAt: null }
        });
        if (!existing) {
            throw new NotFoundError('Usuario no encontrado');
        }

        const updateData = { ...data };
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
    




