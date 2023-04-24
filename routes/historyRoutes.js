const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

//Get all generations
router.get("/", async (req, res) => {
  username = req.query.username;
  try {
    const generations = await Generation.find({ user: username }).sort({
      time: -1,
    });
    res.json(generations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting generations" });
  }
});

module.exports = router;
