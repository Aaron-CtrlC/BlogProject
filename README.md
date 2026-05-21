# BlogProject API

API REST para un blog con usuarios y posts. La armé con Express + TypeScript + Prisma + PostgreSQL, todo corriendo con Docker.

La idea era tener algo limpio, bien estructurado y listo para mostrar. Le metí manejo de errores centralizado, auth con JWT, validación con Zod, soft delete, y tests.

---

## Stack

| Capa | Qué usé |
|------|---------|
| Runtime | Node 24, TypeScript 5.9 |
| Framework | Express 5 |
| ORM | Prisma 7 con adapter PostgreSQL |
| DB | PostgreSQL 15 |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Validación | Zod 4 |
| Tests | Jest + Supertest |
| Infra | Docker + docker-compose |

---

## Arquitectura

Viene todo explicado con diagramas en la carpeta [`Docs/`](Docs/):

- [Diagrama de la API REST](Docs/api-diagram.md) — rutas, middleware, flujo
- [Modelo de datos](Docs/data-model.md) — entidades, relaciones, campos
- [Arquitectura de clases](Docs/class-architecture.md) — controllers, services, errores

En dos palabras: **Controllers -> Services -> Prisma**. Los controllers no tienen lógica de negocio, solo orquestan. Los services hacen las validaciones y tiran `AppError` cuando algo no está bien. El `errorHandler` centralizado se encarga de responder con el formato correcto.

---

## Cómo levantar el proyecto

```bash
# Clonás el repo
git clone https://github.com/Aaron-CtrlC/BlogProject.git
cd BlogProject

# Lo levantás con Docker
docker compose up
```

La primera vez tarda porque builda la imagen (npm install, prisma generate, etc). Después arranca al toque.

Apenas está listo, la API responde en `http://localhost:3000`.

### Variables de entorno

Están configuradas en `docker-compose.yml`. Las que necesitás:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string a PostgreSQL |
| `JWT_SECRET` | Secreto para firmar tokens (cambialo antes de usar en producción) |
| `PORT` | Puerto donde escucha el server (default: 3000) |

Si falta alguna al arrancar, la app no se levanta — `src/config/env.ts` se encarga de validarlas.

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /users | ❌ | Crear usuario |
| POST | /users/login | ❌ | Iniciar sesión → devuelve JWT |
| GET | /users | ❌ | Listar usuarios |
| GET | /users/:id | ❌ | Buscar usuario por ID |
| PUT | /users/:id | ✅ | Actualizar perfil |
| DELETE | /users/:id | ✅ | Eliminar cuenta |
| POST | /posts | ✅ | Crear post |
| GET | /posts | ❌ | Listar posts |
| GET | /posts/:id | ❌ | Ver post |
| PUT | /posts/:id | ✅ | Editar post (solo dueño) |
| DELETE | /posts/:id | ✅ | Eliminar post (solo dueño) |

### Formato de respuestas

Todas las respuestas siguen el mismo formato:

```json
// Éxito
{ "success": true, "data": { ... } }

// Éxito con mensaje
{ "success": true, "data": { ... }, "message": "..." }

// Error
{ "success": false, "error": "...", "statusCode": 400 }

// Error de validación
{ "success": false, "error": "Error de validación", "details": [...], "statusCode": 400 }
```

---

## Tests

```bash
docker compose run --rm app npm test
```

Corre los tests con Jest + Supertest. Los tests pegan contra la API de verdad (conectada a PostgreSQL), así que necesitás tener los servicios de Docker levantados.

Los tests cubren:
- Validación de schemas (campos faltantes, datos inválidos)
- Creación de usuarios y posts
- Login y generación de tokens
- Auth middleware (token faltante, malformado, inválido)
- CRUD completo de users y posts
- Autorización (no podés modificar/eliminar recursos de otro)

---

## Diagramas

> También están en [`Docs/`](Docs/) como archivos separados si querés verlos en detalle.

### Arquitectura de la API

```mermaid
graph TB
    subgraph Clientes
        A[Client HTTP]
    end

    subgraph Middleware
        M1[express.json]
        M2[auth middleware]
        M3[asyncHandler]
        M4[errorHandler]
    end

    subgraph Rutas_Publicas["Rutas Públicas"]
        U1["POST /users"]
        U2["POST /users/login"]
        U3["GET /users"]
        U4["GET /users/:id"]
        P1["GET /posts"]
        P2["GET /posts/:id"]
    end

    subgraph Rutas_Protegidas["Rutas Protegidas (auth)"]
        U5["PUT /users/:id"]
        U6["DELETE /users/:id"]
        P3["POST /posts"]
        P4["PUT /posts/:id"]
        P5["DELETE /posts/:id"]
    end

    A --> M1
    M1 --> Rutas_Publicas
    M1 --> M2
    M2 --> Rutas_Protegidas
    Rutas_Publicas --> M3
    Rutas_Protegidas --> M3
    M3 --> M4

    subgraph Controladores["Controllers"]
        UC[UserController]
        PC[PostController]
    end

    U1 --> UC
    U2 --> UC
    U3 --> UC
    U4 --> UC
    U5 --> UC
    U6 --> UC
    P1 --> PC
    P2 --> PC
    P3 --> PC
    P4 --> PC
    P5 --> PC

    UC --> US[UserService]
    PC --> PS[PostService]
    US --> PR[Prisma Client]
    PS --> PR
    PR --> DB[(PostgreSQL)]
```

### Modelo de datos (ERD)

```mermaid
erDiagram
    User {
        string id PK "UUID"
        string email UK "Email único"
        string name "Nombre del usuario"
        string password "Hash bcrypt"
        datetime deletedAt "Soft delete"
    }

    Post {
        string id PK "UUID"
        string title "Título del post"
        string content "Contenido del post"
        boolean published "Publicado sí/no"
        string authorId FK "Referencia a User.id"
        datetime deletedAt "Soft delete"
    }

    User ||--o{ Post : "tiene"
```

### Diagrama de clases

```mermaid
classDiagram
    class AppError {
        +string message
        +number statusCode
        +constructor(message, statusCode)
    }

    class NotFoundError {
        +constructor(message)
    }

    class ForbiddenError {
        +constructor(message)
    }

    class UnauthorizedError {
        +constructor(message)
    }

    class ConflictError {
        +constructor(message)
    }

    AppError <|-- NotFoundError
    AppError <|-- ForbiddenError
    AppError <|-- UnauthorizedError
    AppError <|-- ConflictError

    class UserController {
        -UserService userService
        +create(req, res)
        +login(req, res)
        +findAll(req, res)
        +findById(req, res)
        +update(req, res)
        +delete(req, res)
    }

    class PostController {
        -PostService postService
        +create(req, res)
        +findAll(req, res)
        +findById(req, res)
        +update(req, res)
        +delete(req, res)
    }

    class UserService {
        +create(data)
        +findById(id)
        +findByEmail(email)
        +findAll()
        +updateUser(id, data)
        +validatePassword(plain, hashed)
        +deleteUser(id)
    }

    class PostService {
        +createPost(data, authorId)
        +updatePostById(id, data, authorId)
        +deletePost(id, authorId)
        +findById(postId)
        +findAll(authorId?)
    }

    class auth {
        +AuthRequest interface
        +auth(req, res, next)
    }

    class errorHandler {
        +errorHandler(err, req, res, next)
    }

    class asyncHandler {
        +asyncHandler(fn)
    }

    class sendSuccess {
        +sendSuccess(res, data, options?)
    }

    class prisma {
        +PrismaClient instance
    }

    UserController --> UserService
    PostController --> PostService
    UserService --> prisma
    PostService --> prisma
    UserController --> auth
    PostController --> auth
    UserController --> asyncHandler
    PostController --> asyncHandler
    UserController --> sendSuccess
    PostController --> sendSuccess
    UserController --> AppError
    PostController --> AppError
    auth --> UnauthorizedError
    errorHandler --> AppError
```

---

## Ideas para seguir

Si alguna vez le meto más tiempo, esto es lo que tengo en mente:

| Feature | Para qué |
|---------|----------|
| **Roles** (admin, user) | Usuarios con permisos especiales |
| **Categorías / Tags** | Clasificar posts por tema |
| **Comentarios** | Comentarios anidados en posts, con su propio CRUD |
| **Paginación** | `GET /posts?page=1&limit=10` para cuando haya muchos posts |
| **Rate limiting** | Evitar que alguien spamee `/users/login` |
| **Refresh tokens** | No tener que loguearse cada 7 días |
| **Subir imágenes** | Multer + S3 o similar para imágenes en posts |
| **Swagger / OpenAPI** | Documentación interactiva de la API |
| **CI/CD** | GitHub Actions que corra tests automáticamente |
| **Búsqueda** | Buscar posts por título o contenido con FTS de PostgreSQL |

