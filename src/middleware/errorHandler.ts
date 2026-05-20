import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    // Errores de validación Zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            error: 'Error de validación',
            details: err.issues
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            error: err.message
        });
    }

    // Errores conocidos de Prisma
    const prismaErr = err as { code?: string; meta?: object };
    if (prismaErr.code) {
        switch (prismaErr.code) {
            case 'P2025':
                return res.status(404).json({ success: false, statusCode: 404, error: 'Recurso no encontrado' });
            case 'P2002':
                return res.status(409).json({ success: false, statusCode: 409, error: 'El recurso ya existe' });
            default:
                break;
        }
    }

    res.status(500).json({ success: false, statusCode: 500, error: 'Error interno del servidor' });
}