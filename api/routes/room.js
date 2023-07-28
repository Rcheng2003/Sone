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

router.delete("/delete/:id", async (req, res) => {
  try {
    const result = await StudyRoom.findByIdAndDelete(req.params.id);

    // Check if the resource was found and deleted successfully
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