# Modelo de Datos — BlogProject

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

### Detalle de campos

**User**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | `@id @default(uuid())` |
| email | String | `@unique`, validado con Zod email |
| name | String | `min(2)` |
| password | String | `min(8).max(50)`, se almacena hasheado con bcrypt |
| deletedAt | DateTime? | Nullable, soft delete |

**Post**
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | UUID | `@id @default(uuid())` |
| title | String | `min(10).max(200)` |
| content | String | `min(20)` |
| published | Boolean | `@default(false)` |
| authorId | String | FK → User.id |
| deletedAt | DateTime? | Nullable, soft delete |
