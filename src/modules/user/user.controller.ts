import { z } from 'zod';
import { createUserSchema, loginSchema, updateUserSchema } from "./user.schema.js";
import { UserService } from "./user.service.js";
import { UnauthorizedError, NotFoundError, ForbiddenError } from "../../utils/errors.js";

import type { Request, Response } from 'express';
import { generateToken } from "../../utils/jwt.js";
import type { AuthRequest } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";

export class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService()
    }


    create = async (req: Request, res: Response) => {
        const data = createUserSchema.parse(req.body)

        const user = await this.userService.createUser(data)

        sendSuccess(res, { id: user.id, email: user.email, name: user.name }, { statusCode: 201 })

    }


    login = async (req: Request, res: Response) => {
        const data = loginSchema.parse(req.body);

        const user = await this.userService.findUserByEmail(data.email)

        if (!user) {
            throw new UnauthorizedError('Credenciales inválidas');
        }

        const isPasswordValid = await this.userService.validatePassword(data.password, user.password)

        if (!isPasswordValid) {
            throw new UnauthorizedError('Credenciales inválidas');
        }

        const token = generateToken({ userId: user.id, email: user.email });
        sendSuccess(res, { token, userId: user.id, email: user.email })
    }


    findAll = async (req: Request, res: Response) => {
        const users = await this.userService.findAllUsers()

        
        sendSuccess(res, {users: users.map(u => ({ id: u.id, email: u.email, name: u.name }))}, { message: 'Lista de usuarios' })
    }


    findById = async (req: Request, res: Response) => {
        const id = z.string().uuid().parse(req.params.id)

        const user = await this.userService.findUserById(id)

        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }


        
        sendSuccess(res, { id: user.id, email: user.email, name: user.name })
    };

    update = async (req: AuthRequest, res: Response) => {
        const id = z.string().uuid().parse(req.params.id)

        if (req.userId !== id) {
            throw new ForbiddenError('No puedes actualizar otro usuario');
        }

        const user = updateUserSchema.parse(req.body)

        const updatedUser = await this.userService.updateUser(id, user) 


        
        sendSuccess(res, { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name }, { message: 'Update exitoso' })
    }

    delete = async (req: AuthRequest, res: Response) => {
        const id = z.string().uuid().parse(req.params.id)

        if (req.userId !== id) {
            throw new ForbiddenError('No puedes eliminar otro usuario');
        }

        await this.userService.deleteUser(id)

        res.status(204).send();
    }




}