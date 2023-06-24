const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    default: true,
  },
});

const model = mongoose.model("UserData", User);

module.exports = model;
