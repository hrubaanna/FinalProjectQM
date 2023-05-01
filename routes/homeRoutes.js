const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

//Get the most recent generation
// GET /home
// Returns the single most recent generation created by the user

router.get("/", async (req, res) => {
  const username = req.query.username;

  try {
    const latestGeneration = await Generation.find({ user: username })
      .sort({ time: -1 })
      .limit(1);
    res.json(latestGeneration);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting latest generation" });
  }
});

module.exports = router;
