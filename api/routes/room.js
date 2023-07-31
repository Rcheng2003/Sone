const express = require('express');
const StudyRoom = require("../models/StudyRoom");
const Message = require("../models/Message")

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

// find all the public rooms that aren't owned by the user
router.get("/public", async (req,res) =>{
  const userRooms = await StudyRoom.find({public: true, owner: {$ne: req.user.id}});
  return res.status(200).json(userRooms);
});

router.get("/:id", async (req,res) =>{
  const userRoom = await StudyRoom.findOne({_id: req.params.id}); // find all the rooms belonging to the user
  return res.status(200).json(userRoom);
});

router.put("/:id", async (req,res) =>{
  const userRoom = await StudyRoom.updateOne({_id: req.params.id}, 
    {$set: {
      roomName: req.body.roomName, 
      public: req.body.public, 
      capacity: req.body.capacity
    }}); 
  return res.status(200).json(userRoom);
});

router.delete("/delete/:id", async (req, res) => {
  try {
    var result = await StudyRoom.findByIdAndDelete(req.params.id);

    // Check if the resource was found and deleted successfully
    if (!result) {
      return res.status(404).json({ error: "Resource not found" });
    }

    result = await Message.deleteMany({room: req.params.id})

    if (!result) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // If the resource was found and deleted, return a success response
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;