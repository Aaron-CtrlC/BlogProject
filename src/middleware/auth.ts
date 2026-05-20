import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface AuthRequest extends Request {
    userId?: string;
    email?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new UnauthorizedError('No se proporcionó token'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('Token malformado'));
    }

    try {
        const decoded = verifyToken(token) as {userId: string; email: string};
        req.userId = decoded.userId;
        req.email = decoded.email;
        next();
    } catch (error) {
        return next(new UnauthorizedError('Token inválido o expirado'));
    }
};