import { PostService } from './post.service.js';
import { createPostSchema, updatePostSchema } from './post.schema.js';
import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';

import { asyncHandler } from "../../middleware/asyncHandler.js";
import type { CreatePostDTO } from '../../types/post.types.js';


export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    create = asyncHandler(async (req: AuthRequest, res: Response) => {

        const parsed = createPostSchema.parse(req.body);
        const authorId: string = req.userId!;

        const data: CreatePostDTO = {
            ...parsed,
            authorId
        };
        const post = await this.postService.createPost(data, authorId);
        res.status(201).json(post);

    })


    findAll = asyncHandler(async (req: Request, res: Response) => {
        const authorId = req.query.authorId ? String(req.query.authorId) : undefined;
        const posts = await this.postService.findAll(authorId);
        res.json(posts)
    })

    findById = asyncHandler(async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id as string);
        const post = await this.postService.findById(id);

        if (!post) {
            res.status(404).json({ error: 'Post no encontrado' });
            return;
        }

        res.status(200).json(post)


    })


    update = asyncHandler(async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id as string);

        const data = updatePostSchema.parse(req.body);
        const authorId: string = (req as AuthRequest).userId!;
        const post = await this.postService.updatePostById(id, data, authorId)
        res.status(200).json(post)

    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id as string);
        const authorId: string = (req as AuthRequest).userId!;
        await this.postService.deletePost(id, authorId);
        res.status(204).send();
    })
};
