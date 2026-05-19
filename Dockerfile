FROM node:24-slim
WORKDIR /app

# Dependencias primero (cache layer)
COPY package*.json ./
RUN npm install

# Código fuente
COPY . .
RUN npx prisma generate

# Entrypoint: espera DB, corre migraciones, arranca la app
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]