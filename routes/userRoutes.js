const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

//Create a new user
// POST /register
// Create a new user and hash the password
// checks if the username exists in the database

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate and return a JSON Web Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ success: true, token: `Bearer ${token}` });
  } catch (err) {
    console.error("Error creating user ", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      res.status(400).json({ message: "Invalid password" });
    }

    // Generate and return a JSON Web Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ success: true, token: `Bearer ${token}` });
  } catch (err) {
    console.error("Error logging in ", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
