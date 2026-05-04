import { auth } from './../middleware/auth';

export interface Post
{
    id: number;
    title: string;
    content: string;
    published: boolean; 
    authorId: string;
    deletedAt: new Date();
}

export type CreatePostDTO=
{
    title: string;
    content: string;
    published: boolean;
    authorId: string;
}

export type UpdatePostDTO = Partial<CreatePostDTO>