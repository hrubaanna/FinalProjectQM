const express = require("express");
const Generation = require("../models/Generation");

const router = express.Router();

//Get the generations closest to the user's location
// GET /map
// Returns the 40 generations closest to the user's location

router.get("/", async (req, res) => {
  const { user, latitude, longitude } = req.query;

  try {
    const closestGenerations = await Generation.find({
      user,
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    })
      .limit(40)
      .sort({ time: -1 });
    console.log(closestGenerations);
    res.json(closestGenerations);
  } catch (err) {
    console.error("Error finding closest generations ", err);
    res.status(500).json({ message: "Error finding closest generations" });
  }
});

module.exports = router;
