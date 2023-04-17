const mongoose = require("mongoose");

//MongoDB schema for a generation
const GenerationSchema = new mongoose.Schema({
  location: String,
  time: String,
  description: String,
  CA: [
    {
      pattern: String,
      x: Number,
      y: Number,
      color: String,
    },
  ],
});

module.exports = mongoose.model("Generation", GenerationSchema);
