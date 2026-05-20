import { createUserSchema, loginSchema, updateUserSchema } from "./user.schema.js";
import { UserService } from "./user.service.js";
import { UnauthorizedError, NotFoundError, ForbiddenError } from "../../utils/errors.js";

import type { Request, Response } from 'express';
import { generateToken } from "../../../utils/jwt.js";
import type { AuthRequest } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

export class UserController {
    userService: UserService;
    constructor() {
        this.userService = new UserService()
    }


    create = asyncHandler(async (req: Request, res: Response) => {
        const data = createUserSchema.parse(req.body)

        const user = await this.userService.create(data)

        res.status(201).json({ id: user.id, email: user.email, name: user.name })

    })


    login = asyncHandler(async (req: Request, res: Response) => {
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
        res.json({ token, userId: user.id, email: user.email })
    })


    findAll = asyncHandler(async (req: Request, res: Response) => {
        const users = await this.userService.findAll()

        
        res.status(200).json({
            message: 'Lista de usuarios',
            users
        })
    })


    findById = asyncHandler(async (req: Request, res: Response) => {
        const id = (req.params.id as string)

        const user = await this.userService.findById(id)

        if (!user) {
            throw new NotFoundError('Usuario no encontrado');
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name
        })
    });

    update = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string

        if (req.userId !== id) {
            throw new ForbiddenError('No puedes actualizar otro usuario');
        }

        const data = updateUserSchema.parse(req.body)

        const user = await this.userService.updateUser(id, data) 

        res.status(200).json({
            user
        })
    })

    delete = asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string

        if (req.userId !== id) {
            throw new ForbiddenError('No puedes eliminar otro usuario');
        }

        const userDelete = await this.userService.deleteUser(id)

        res.json({ message: 'Delete exitoso', userDelete })
    })




}