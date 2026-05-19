#!/bin/sh
set -e

echo "⏳ Esperando a PostgreSQL en ${DB_HOST:-db}:${DB_PORT:-5432}..."
until pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${POSTGRES_USER:-admin}" -d "${POSTGRES_DB:-blog_db}" 2>/dev/null; do
  sleep 2
done
echo "✅ PostgreSQL disponible"

echo "📦 Corriendo migraciones..."
npx prisma migrate deploy
echo "✅ Migraciones aplicadas"

echo "🚀 Iniciando aplicación..."
exec "$@"
