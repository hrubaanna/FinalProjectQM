const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

// Add a new generation
router.post("/", async (req, res) => {
  const { locationName, location, time, description, CA } = req.body;
  try {
    const newGeneration = new Generation({
      locationName,
      location,
      time,
      description,
      CA,
    });
    const generation = await newGeneration.save();
    res.json(generation);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Error adding generation: ${err.message}` });
  }
});

module.exports = router;
