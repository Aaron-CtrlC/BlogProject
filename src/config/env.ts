import 'dotenv/config';

const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'] as const;

export function assertEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error(`❌ Variables de entorno requeridas faltantes: ${missing.join(', ')}`);
    process.exit(1);
  }
}
