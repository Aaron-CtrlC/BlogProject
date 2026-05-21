# API REST — BlogProject

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
        U1["POST /api/users"]
        U2["POST /api/users/login"]
        U3["GET /api/users"]
        U4["GET /api/users/:id"]
        P1["GET /api/posts"]
        P2["GET /api/posts/:id"]
    end

    subgraph Rutas_Protegidas["Rutas Protegidas (auth)"]
        U5["PUT /api/users/:id"]
        U6["DELETE /api/users/:id"]
        P3["POST /api/posts"]
        P4["PUT /api/posts/:id"]
        P5["DELETE /api/posts/:id"]
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

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /users | ❌ | Crear usuario |
| POST | /users/login | ❌ | Iniciar sesión |
| GET | /users | ❌ | Listar usuarios |
| GET | /users/:id | ❌ | Obtener usuario por ID |
| PUT | /users/:id | ✅ | Actualizar propio usuario |
| DELETE | /users/:id | ✅ | Eliminar propio usuario |
| POST | /posts | ✅ | Crear post |
| GET | /posts | ❌ | Listar posts |
| GET | /posts/:id | ❌ | Obtener post por ID |
| PUT | /posts/:id | ✅ | Actualizar post propio |
| DELETE | /posts/:id | ✅ | Eliminar post propio |
