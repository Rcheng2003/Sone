const express = require('express');
const User = require('../models/User.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Login Endpoint
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({ status: "error", error: "Invalid login" });
  }

  const isPasswordValid = await bcryptjs.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      "someSecretCode666"
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "wrongPassword", user: false });
  }
});

// Register Endpoint
router.post("/register", async (req, res) => {
  try {
    const newPassword = await bcryptjs.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

// Logout Endpoint
router.get('/logout', async (req, res) => {
  localStorage.removeItem("token");
  return res.status(200).json({ message: 'logout success' });
});

module.exports = router;