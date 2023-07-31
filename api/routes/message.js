const express = require("express");
const Message = require("../models/Message")
const StudyRoom = require("../models/StudyRoom")
const User = require("../models/User")
const router = express.Router();

router.post("/", async(req,res) => {
  try {
    const user = await User.findOne({_id: req.user.id})
    const message = await Message.create({
      sender: req.user.id,
      user: user.name,
      content: req.body.content,
      room: req.body.roomId,
    });

    await StudyRoom.findByIdAndUpdate(req.body.roomId, { latestMessage: message });

    return res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

router.get("/:roomId", async(req,res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
    return res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

module.exports = router;