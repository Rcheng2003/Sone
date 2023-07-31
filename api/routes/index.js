const express = require('express');
const authRoutes = require('./auth.js');
const todoRoutes = require('./todo.js');
const userRoutes = require('./user.js');
const studyRoomRoutes = require('./room.js');
const messageRoutes = require("./message.js")
const eventRoutes = require('./event.js');
const checkAuth = require("../utils/checkAuth");

const router = express.Router();

router.use('/auth', authRoutes); /* endpoint: /api/auth/<theHTTPRequestinAuthRoutes> */
router.use('/todos', checkAuth, todoRoutes); /* endpoint: /api/todos/<theHTTPRequestinTodoRoutes> */
router.use('/user', checkAuth, userRoutes); /* endpoint: /api/user/<theHTTPRequestinUserRoutes> */
router.use('/study-room',checkAuth, studyRoomRoutes);
router.use('/message',checkAuth, messageRoutes);
router.use('/event', eventRoutes); /* endpoint: /api/user/<theHTTPRequestinUserRoutes> */

module.exports = router;