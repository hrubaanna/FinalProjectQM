const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

//Get all generations
router.get("/", async (req, res) => {
  try {
    const generations = await Generation.find();
    res.json(generations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error getting generations" });
  }
});

module.exports = router;
