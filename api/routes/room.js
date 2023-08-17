const express = require('express');
const StudyRoom = require("../models/StudyRoom");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

router.post("/create", async (req,res) =>{
  try {
    var newRoom = await StudyRoom.create({
      owner: req.user.id,
      roomName: req.body.roomName,
      users: [],
      roomAdmin: [],
      public: req.body.public,
      capacity: req.body.capacity
    });

    newRoom = await newRoom.populate("owner", "name email");
    
    res.status(200).json(newRoom);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

router.get("/", async (req,res) =>{
  var userRooms = await StudyRoom.find({owner: req.user.id})
    .populate("owner", "name email"); // find all the rooms belonging to the user
  return res.status(200).json(userRooms);
});

// find all the public rooms that aren't owned by the user
router.get("/public", async (req,res) =>{
  var userRooms = await StudyRoom.find({public: true, owner: {$ne: req.user.id}})
    .populate("owner", "name email");
  return res.status(200).json(userRooms);
});

router.get("/:id", async (req,res) =>{
  var userRoom = await StudyRoom.findOne({_id: req.params.id})
    .populate("owner", "name email"); // find all the rooms belonging to the user
  return res.status(200).json(userRoom);
});

router.put("/leaveRoom/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.id;

    // Update the user's inRoom property
    const userResult = await User.updateOne(
      { _id: userId },
      { $set: { inRoom: null } }
    );

      // If user's inRoom property is updated successfully, remove user from room's user list
      const roomResult = await StudyRoom.updateOne(
        { _id: roomId },
        { $pull: { users: userId } }
      );

      if (roomResult.nModified > 0) {
        return res.status(200).send({ message: 'Room left successfully' });
      } else {
        return res.status(400).send({ message: 'User not found in room' });
      }
    
  } catch (error) {
    return res.status(500).send({ message: 'Server error', error });
  }
});

router.put("/:id", async (req,res) =>{
  var userRoom = await StudyRoom.updateOne({_id: req.params.id}, 
    {$set: {
      roomName: req.body.roomName, 
      public: req.body.public, 
      capacity: req.body.capacity
    }}); 
  return res.status(200).json(userRoom);
});

router.put("/joinedRoom/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.id;
    const user = await User.findOne({_id: userId});

    // Fetch the room details
    const room = await StudyRoom.findById(roomId);

    // Check if the room exists
    if (!room) {
      return res.status(404).send({ message: 'Room not found' });
    }
    if (user.inRoom && user.inRoom._id.toString() === roomId) {
      return res.status(400).send({ message: 'Already in the Room' });
    }
    // Check if the room has reached its capacity
    if (room.users.length >= room.capacity) {
      return res.status(400).send({ message: 'Room is full' });
    }
    // Update the user's inRoom property
    await User.updateOne(
      { _id: userId },
      { $set: { inRoom: roomId } }
    );

    // Add user to room's user list
    const roomResult = await StudyRoom.updateOne(
      { _id: roomId },
      { $addToSet: { users: userId } } // $addToSet ensures no duplicate userId
    );

    if (roomResult.nModified > 0 || roomResult.ok > 0) {
      return res.status(200).send({ message: 'Joined room successfully' });
    } else {
      return res.status(400).send({ message: 'Failed to join room' });
    }

  } catch (error) {
    return res.status(500).send({ message: 'Server error', error });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    var result = await StudyRoom.findByIdAndDelete(roomId);

    // Check if the study room was found and deleted successfully
    if (!result) {
      return res.status(404).json({ error: "StudyRoom not found" });
    }

    // Delete all messages associated with the room
    await Message.deleteMany({ room: roomId });

    // Reset inRoom property for all users who were in the deleted room
    await User.updateMany({ inRoom: roomId }, { $unset: { inRoom: 1 } });

    // If the study room was found and deleted, return a success response
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;