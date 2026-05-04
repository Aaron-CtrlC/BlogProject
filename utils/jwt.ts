import 'dotenv/config.js'
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en .env');
}



export const generateToken = (payload: string | object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};