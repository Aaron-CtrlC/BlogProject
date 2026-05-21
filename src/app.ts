import express from 'express';
import userRoutes from './modules/user/user.route.js';
import postRoutes from './modules/post/post.route.js';

import 'dotenv/config'
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(errorHandler);

export default app;
