const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudyRoom = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId, ref: "User" 
    },
    roomName: { 
      type: String
    },
    // List of users
    users: [{ 
      type: Schema.Types.ObjectId, ref: "User" 
    }],
    roomAdmins: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: "User" 
    }],
    public: {
      type: Boolean,
      default: false
    },
    capacity: {
      type: Number,
    }
  },
  { timestamps: true }
);

const room = mongoose.model("StudyRoom", StudyRoom);

module.exports = room;