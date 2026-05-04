import { Router } from "express";
import { PostController } from "./post.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router()
const postController = new PostController()

router.post('/posts', auth, postController.create);
router.get('/posts/:id', postController.findById);
router.put('/posts/:id', auth, postController.update);

router.get('/posts', postController.findAll);
router.delete('/posts/:id',auth, postController.delete);

export default router;