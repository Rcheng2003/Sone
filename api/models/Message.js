const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    user: { 
      type: String,
    },
    content: { 
      type: String, 
      trim: true 
    },
    room: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "StudyRoom" 
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;