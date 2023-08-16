const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
