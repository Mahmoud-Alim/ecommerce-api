import express from "express";
import User from "../models/users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");
    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.passwordHash, // In a real app, you should hash this password before saving
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();

    if (!user) return res.status(400).send("the user cannot be created!");

    res.send(user);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

export default router;
