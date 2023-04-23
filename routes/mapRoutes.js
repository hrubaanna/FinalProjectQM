const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

//Get the generations closest to the user's location
router.get("/", async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const closestGenerations = await Generation.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    }).limit(20);
    console.log(closestGenerations);
    res.json(closestGenerations);
  } catch (err) {
    console.error("Error finding closest generations ", err);
    res.status(500).json({ message: "Error finding closest generations" });
  }
});

module.exports = router;
