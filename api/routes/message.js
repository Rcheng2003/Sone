const express = require("express");
const Message = require("../models/Message")
const User = require("../models/User")
const router = express.Router();

router.post("/", async(req,res) => {
  try {
    var message = await Message.create({
      sender: req.user.id,
      content: req.body.content,
      room: req.body.roomId,
    });

    message = await message.populate("sender", "name email profilePicture");
    message = await message.populate("room");

    return res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

router.get("/:roomId", async(req,res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate("sender", "name email profilePicture")
      .populate("room");
    return res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

module.exports = router;