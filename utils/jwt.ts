import jwt from 'jsonwebtoken';

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET no está definido en .env');
    }
    return secret;
}

export const generateToken = (payload: string | object) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, getJwtSecret());
};