const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
        type: String,
        require: true
    },
    closed: {
        type: Boolean,
        default: false
    },
    date: {
        type: String,
        default: Date.now()
    },
    position: {
        type: {
            x: Number,
            y: Number
        },
        default: { x: 500, y: -500 }
    }
})

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;