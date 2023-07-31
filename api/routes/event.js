const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events
router.get('/userEvents', (req, res) => {
  Event.find()
    .then((events) => res.json(events))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// POST a new event
router.post('/new', (req, res) => {
  const {title, start, end } = req.body;

  const parsedStart = new Date(start);
  const parsedEnd = new Date(end);

  const newEvent = new Event({ title, start: parsedStart, end: parsedEnd });

  newEvent
    .save()
    .then((event) => res.status(201).json(event))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// DELETE an event
router.delete('/delete/:id', (req, res) => {
  Event.findByIdAndRemove(req.params.id)
    .then((event) => res.json(event))
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
