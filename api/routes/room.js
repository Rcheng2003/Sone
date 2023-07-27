const express = require('express');
const StudyRoom = require("../models/StudyRoom");

const router = express.Router();

router.post("/create", async (req,res) =>{
  try {
    const newRoom = await StudyRoom.create({
      owner: req.user.id,
      roomName: req.body.roomName,
      users: [req.user.id],
      roomAdmin: [],
      public: req.body.public,
      capacity: req.body.capacity
    });

    newRoom.save();

    res.status(200).json(newRoom);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

router.get("/", async (req,res) =>{
  const userRooms = await StudyRoom.find({owner: req.user.id}); // find all the rooms belonging to the user
  return res.status(200).json(userRooms);
});

module.exports = router;