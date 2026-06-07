import { z } from 'zod';
import { PostService } from './post.service.js';
import { createPostSchema, updatePostSchema } from './post.schema.js';
import type { Request, Response } from 'express';
import { type AuthRequest, requireUserId } from '../../middleware/auth.js';
import { NotFoundError } from '../../utils/errors.js';
import { sendSuccess } from "../../utils/response.js";

export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    create = async (req: AuthRequest, res: Response) => {

        const parsed = createPostSchema.parse(req.body);
        const authorId = requireUserId(req);

        const data = {
            ...parsed,
            authorId
        };
        const post = await this.postService.createPost(data, authorId);
        sendSuccess(res, post, { statusCode: 201 });

    }


    findAll = async (req: Request, res: Response) => {
        const authorId = req.query.authorId ? String(req.query.authorId) : undefined;
        const posts = await this.postService.findAllPosts(authorId);
        sendSuccess(res, posts)
    }

    findById = async (req: Request, res: Response) => {
        const id = z.string().uuid().parse(req.params.id);
        const post = await this.postService.findPostById(id);

        if (!post) {
            throw new NotFoundError('Post no encontrado');
        }

        sendSuccess(res, post)
    }


    update = async (req: AuthRequest, res: Response) => {
        const id = z.string().uuid().parse(req.params.id);

        const data = updatePostSchema.parse(req.body);
        const authorId = requireUserId(req);
        const post = await this.postService.updatePost(id, data, authorId)
        sendSuccess(res, post)

    }

    delete = async (req: AuthRequest, res: Response) => {
        const id = z.string().uuid().parse(req.params.id);
        const authorId = requireUserId(req);
        await this.postService.deletePost(id, authorId);
        res.status(204).send();
    }
};
