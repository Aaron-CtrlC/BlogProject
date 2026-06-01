import { createUserSchema, loginSchema, updateUserSchema } from "./user.schema.js";
import { UserService } from "./user.service.js";
import { UnauthorizedError, NotFoundError, ForbiddenError } from "../../utils/errors.js";

import type { Request, Response } from 'express';
import { generateToken } from "../../../utils/jwt.js";
import type { AuthRequest } from "../../middleware/auth.js";
import { sendSuccess } from "../../utils/response.js";

export class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService()
    }


    create = async (req: Request, res: Response) => {
        const data = createUserSchema.parse(req.body)

        const user = await this.userService.create(data)

        sendSuccess(res, { id: user.id, email: user.email, name: user.name }, { statusCode: 201 })

    }


    login = async (req: Request, res: Response) => {
        const data = loginSchema.parse(req.body);

        const user = await this.userService.findByEmail(data.email)

        if (!user) {
            throw new UnauthorizedError('Credenciales inválidas');
        }

        const isValid = await this.userService.validatePassword(data.password, user.password)

        if (!isValid) {
            throw new UnauthorizedError('Credenciales inválidas');
        }

        const token = generateToken({ userId: user.id, email: user.email });
        sendSuccess(res, { token, userId: user.id, email: user.email })
    }


    findAll = async (req: Request, res: Response) => {
        const users = await this.userService.findAll()

        
        sendSuccess(res, users, { message: 'Lista de usuarios' })
    }


    findById = async (req: Request, res: Response) => {
        const id = (req.params.id as string)

        const user = await this.userService.findById(id)

        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }

        sendSuccess(res, { id: user.id, email: user.email, name: user.name })
    };

    update = async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string

        if (req.userId !== id) {
            throw new ForbiddenError('No puedes actualizar otro usuario');
        }

        const data = updateUserSchema.parse(req.body)

        const user = await this.userService.updateUser(id, data) 

        sendSuccess(res, user)
    }

    delete = async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string

        if (req.userId !== id) {
            throw new ForbiddenError('No puedes eliminar otro usuario');
        }

        const userDelete = await this.userService.deleteUser(id)

        sendSuccess(res, userDelete, { message: 'Delete exitoso' })
    }




}