import express from 'express';
import userRoutes from './src/modules/user/user.route.js';
import postRoutes from './src/modules/post/post.route.js';

import 'dotenv/config'
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

