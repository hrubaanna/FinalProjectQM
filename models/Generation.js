const mongoose = require("mongoose");

//MongoDB schema for a generation
const GenerationSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  time: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  CA: {
    type: [
      {
        pattern: String,
        x: Number,
        y: Number,
        color: String,
      },
    ],
    required: true,
  },
});

//Create a 2dsphere index for the location field
GenerationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Generation", GenerationSchema);
