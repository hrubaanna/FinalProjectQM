const mongoose = require("mongoose");
const Generation = require("./models/Generation");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generation1 = new Generation({
  location: "Hackney",
  time: "Monday",
  description: "A beautiful day in the park",
  CA: [{ pattern: "glider", x: 5, y: 5, color: "rgb(128, 0, 128)" }],
});

const generation2 = new Generation({
  location: "Camden",
  time: "Friday",
  description: "test",
  CA: [{ pattern: "loaf", x: 5, y: 5, color: "rgb(266, 15, 20)" }],
});

// Save the documents to the database
const insertData = async () => {
  try {
    await generation1.save();
    console.log("Generation 1 saved!");

    await generation2.save();
    console.log("Generation 2 saved!");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

insertData();
