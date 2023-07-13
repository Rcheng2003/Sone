const express = require('express');
const authRoutes = require('./auth.js');
const todoRoutes = require('./todo.js');
const userRoutes = require('./user.js');

const router = express.Router();

router.use('/auth', authRoutes); /* endpoint: /api/auth/<theHTTPRequestinAuthRoutes> */
router.use('/todos',todoRoutes); /* endpoint: /api/todos/<theHTTPRequestinTodoRoutes> */
router.use('/user',userRoutes); /* endpoint: /api/user/<theHTTPRequestinUserRoutes> */

module.exports = router;