const mongoose = require("mongoose");
const Generation = require("../models/Generation");

exports.findClosestGenerations = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const closestGenerations = await Generation.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000,
        },
      },
    })
      .limit(10)
      .exec();

    res.status(200).json(closestGenerations);
  } catch (err) {
    console.error("Error finding closest generations ", err);
    res.status(500).json({ message: "Error finding closest generations" });
  }
};
