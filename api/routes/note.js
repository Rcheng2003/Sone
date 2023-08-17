const express = require('express');
const Note = require('../models/Note.js');

const router = express.Router();

router.get("/userNotes", async (req, res) => {
  const notes = await Note.find({user: req.user.id}); // find all the todos belonging to the user
  return res.status(200).json(notes);
});

router.post("/new", (req, res) => {
  const note = new Note({
    user: req.user.id, // req.user is the user object for current user logged in
    text: req.body.text,
    date: req.body.date
  });

  note.save();

  res.json(note);
});

router.delete("/delete/:id", async (req, res) => {
  const result = await Note.findByIdAndDelete(req.params.id);

  res.json(result);
});

router.get("/close/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);

  note.closed = !note.closed;

  note.save();

  res.json(note);
});

router.put("/updateT/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);

  note.text = req.body.text;

  note.save();

  res.json(note);
});

router.put("/updateP/:id", async (req, res) => {
    const note = await Note.findById(req.params.id);
  
    note.position = req.body.position;
  
    note.save();
  
    res.json(note);
  });

  router.delete("/delete-all", async (req, res) => {
    const result = await Note.deleteMany({});
  
    res.json(result);
  });

module.exports = router;