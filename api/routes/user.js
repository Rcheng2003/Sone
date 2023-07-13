import express from 'express';
import User from "../models/User";
import jwt from "jsonwebtoken"

const router = express.Router();

router.get("/profile", async (req, res) => {
  const token = req.headers["access-token"];

  try {
    const decoded = jwt.verify(token, "someSecretCode666");
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

export default router