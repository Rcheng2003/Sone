const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "/images/SoneDefaultPFP.png"
  },
  inRoom: {
      type: Schema.Types.ObjectId,
      ref: 'StudyRoom',
  }

});

const User = mongoose.model("User", UserSchema);
module.exports = User;
