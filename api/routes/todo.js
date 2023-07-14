const express = require('express');
const Todo = require('../models/Todo.js');

const router = express.Router();

router.get("/userTodos", async (req, res) => {
  const todos = await Todo.find({user: req.user.id}); // find all the todos belonging to the user
  return res.status(200).json(todos);
});

router.post("/new", (req, res) => {
  const todo = new Todo({
    user: req.user.id, // req.user is the user object for current user logged in
    text: req.body.text,
  });

  todo.save();

  res.json(todo);
});

router.delete("/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);

  res.json(result);
});

router.get("/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.complete = !todo.complete;

  todo.save();

  res.json(todo);
});

router.put("/todo/update/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  todo.text = req.body.text;

  todo.save();

  res.json(todo);
});

module.exports = router;