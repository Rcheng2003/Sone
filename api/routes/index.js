import express from 'express';
import authRoutes from './auth.js';
import todoRoutes from './todo.js';
import userRoutes from './user.js';

const router = express.Router();

router.use('/auth', authRoutes); /* endpoint: /api/auth/<theHTTPRequestinAuthRoutes> */
router.use('/todos',todoRoutes); /* endpoint: /api/todos/<theHTTPRequestinTodoRoutes> */
router.use('/user',userRoutes); /* endpoint: /api/user/<theHTTPRequestinUserRoutes> */

export default router;