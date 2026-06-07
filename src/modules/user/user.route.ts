import { Router } from 'express';
import { UserController } from './user.controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();
const userController = new UserController();

router.post('/users', userController.create);
router.get('/users', userController.findAll);
router.get('/users/:id', userController.findById);
router.put('/users/:id', auth, userController.update);
router.delete('/users/:id', auth, userController.delete);
router.post('/users/login', userController.login);

export default router;
