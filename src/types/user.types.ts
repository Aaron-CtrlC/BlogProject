
export interface UserDTO
{
    id: string;
    email: string;
    name: string;
    password?: string
}

export type CreateUserDTO= {
    email: string;
    name: string;
    password: string;
}

export type LoginDTO= {
    email:string;
    password: string;
}

export type UpdateUserDTO = {
    email?: string;
    name?: string;
    password?: string;
}