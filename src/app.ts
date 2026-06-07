import express from 'express';
import userRoutes from './modules/user/user.route.js';
import postRoutes from './modules/post/post.route.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(userRoutes);
app.use(postRoutes);
app.use(errorHandler);

export default app;
