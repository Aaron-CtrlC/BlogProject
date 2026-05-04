import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt.js';



export interface AuthRequest extends Request {
    userId?: string;
    email?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token malformado' })
    }

    try {
        const decoded = verifyToken(token) as {userId: string; email:string}
        req.userId = decoded.userId;
        req.email = decoded.email;
        next()
    }
    catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }


}