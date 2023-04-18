const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

//Get the most recent generation
router.get("/", async (req, res) => {
  try {
    const latestGeneration = await Generation.find()
      .sort({ time: -1 })
      .limit(1);
    res.json(latestGeneration);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting latest generation" });
  }
});

module.exports = router;