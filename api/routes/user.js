const express = require('express');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/profilePics',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },  // limiting files size to 1MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
}).single('profilePic');

router.get("/profile", async (req, res) => {
  const user = await User.findOne({ email: req.user.email }); //req.user is the user currently logged in
  return res.json({ status: "ok", name: user.name, email: user.email, pfp: user.profilePicture});
});

router.post("/uploadPfp", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      // Assuming you have the user's email accessible from the request
      const filePath = `/uploads/profilePics/${req.file.filename}`;
      try {
        const user = await User.findOneAndUpdate({ email: req.user.email }, { profilePicture: filePath }, { new: true });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json({ status: 'ok', filePath });
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  });
});

module.exports = router;