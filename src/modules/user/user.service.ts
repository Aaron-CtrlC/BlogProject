import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import type { User } from '../../generated/client/client.js';
import type { CreateUserInput, UpdateUserInput } from './user.schema.js';
import { NotFoundError, ForbiddenError } from '../../utils/errors.js';

export class UserService {
  async createUser(data: CreateUserInput) {
    return prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  async updateUser(id: string, data: UpdateUserInput, requestingUserId?: string) {
    const existing = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundError('Usuario no encontrado');
    }
    if (requestingUserId && existing.id !== requestingUserId) {
      throw new ForbiddenError('No puedes modificar otro usuario');
    }

    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async deleteUser(id: string, requestingUserId?: string) {
    const existing = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundError('Usuario no encontrado');
    }
    if (requestingUserId && existing.id !== requestingUserId) {
      throw new ForbiddenError('No puedes eliminar otro usuario');
    }

    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
