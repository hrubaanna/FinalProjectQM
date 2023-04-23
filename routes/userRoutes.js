const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

//Create a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error("Error creating user ", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Error logging in ", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
