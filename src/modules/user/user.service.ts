import { prisma } from '../../config/prisma.js';
import bcrypt from 'bcrypt';
import type { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../types/user.types.js';
import type { UpdatePostDTO } from '../../types/post.types.js';

export class UserService {
    async create(data: CreateUserDTO) {

        const hashedPassword = await bcrypt.hash(data.password, 10)
        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
            }
        })
    }

    async findById(id: string): Promise<UserDTO | null> {
        const user: UserDTO | null = await prisma.user.findFirst({
            where:
            {
                id: id,
                deletedAt: null
            }
        });

        return user;
    }

    async findByEmail(email: string): Promise<UserDTO | null> {
        const user: UserDTO | null = await prisma.user.findFirst({
            where: {
                email: email,
                deletedAt: null
            }
        });
        return user;
    }


    async findAll(): Promise<UserDTO[]> {
        const usersList: UserDTO[] = await prisma.user.findMany({
            where: {
                deletedAt: null
            }
        });
        return usersList;
    }

    async updateUser(id: string, data: UpdateUserDTO) {
        const updateData: Partial<UpdateUserDTO> = { ...data }; 

        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        const userUpdated = await prisma.user.update({
            where: { id, deletedAt: null }, 
            data: updateData
        });
        return userUpdated;
    }


    async validatePassword(plainPassword: string, hashedPassword: string) {

        return bcrypt.compare(plainPassword, hashedPassword)
    }


    async deleteUser(id: string) {


        return prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }

}
    




