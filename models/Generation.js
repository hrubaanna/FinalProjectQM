const mongoose = require("mongoose");

//MongoDB schema for a generation
const GenerationSchema = new mongoose.Schema({
  location: String,
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
  time: Date,
  description: String,
  CA: {
    pattern: String,
    x: Number,
    y: Number,
    color: String,
  },
});

//Create a 2dsphere index for the location field
GenerationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Generation", GenerationSchema);
