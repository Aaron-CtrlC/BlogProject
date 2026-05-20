import { PostService } from './post.service.js';
import { createPostSchema, updatePostSchema } from './post.schema.js';
import type { Request, Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import { NotFoundError } from '../../utils/errors.js';
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";


export class PostController {
    private postService: PostService;

    constructor() {
        this.postService = new PostService();
    }

    create = asyncHandler(async (req: AuthRequest, res: Response) => {

        const parsed = createPostSchema.parse(req.body);
        const authorId: string = req.userId!;

        const data = {
            ...parsed,
            authorId
        };
        const post = await this.postService.createPost(data, authorId);
        sendSuccess(res, post, { statusCode: 201 });

    })


    findAll = asyncHandler(async (req: Request, res: Response) => {
        const authorId = req.query.authorId ? String(req.query.authorId) : undefined;
        const posts = await this.postService.findAll(authorId);
        sendSuccess(res, posts)
    })

    findById = asyncHandler(async (req: Request, res: Response) => {
        const id: string = req.params.id as string;
        const post = await this.postService.findById(id);

        if (!post) {
            throw new NotFoundError('Post no encontrado');
        }

        sendSuccess(res, post)
    })


    update = asyncHandler(async (req: Request, res: Response) => {
        const id: string = req.params.id as string;

        const data = updatePostSchema.parse(req.body);
        const authorId: string = (req as AuthRequest).userId!;
        const post = await this.postService.updatePostById(id, data, authorId)
        sendSuccess(res, post)

    })

    delete = asyncHandler(async (req: Request, res: Response) => {
        const id: string = req.params.id as string;
        const authorId: string = (req as AuthRequest).userId!;
        await this.postService.deletePost(id, authorId);
        res.status(204).send();
    })
};
