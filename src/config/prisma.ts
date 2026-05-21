import { PrismaClient } from "../generated/client/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

class DatabaseConnection {
    private static instance: PrismaClient;
    private constructor() {
        console.log('Conexión a DB inicializada');
    }
    public static getInstance(): PrismaClient {
        if (!DatabaseConnection.instance) {
            const connectionString = process.env.DATABASE_URL;
            const pool = new Pool({ connectionString });
            const adapter = new PrismaPg(pool as any);
            DatabaseConnection.instance = new PrismaClient({
                adapter,
                log: ['query', 'error', 'warn'],
            });
        }
        return DatabaseConnection.instance;
    }
}
export const prisma = DatabaseConnection.getInstance();
