const mongoose = require("mongoose");
const Generation = require("./models/Generation");
const Environment = require("./Environment");

mongoose.connect(Environment.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generation1 = new Generation({
  locationName: "Hackney",
  location: {
    type: "Point",
    coordinates: [-0.055318, 51.54324],
  },
  time: new Date("2023-03-15T10:30:00"),
  description: "A nice day in the park",
  CA: [{ pattern: "glider", x: 5, y: 5, color: "rgb(128, 0, 128)" }],
});

const generation2 = new Generation({
  locationName: "Victoria Park",
  location: {
    type: "Point",
    coordinates: [-0.047285, 51.536379],
  },
  time: new Date("2023-02-25T14:15:00"),
  description: "Sunny afternoon by the lake",
  CA: [{ pattern: "loaf", x: 5, y: 5, color: "rgb(255, 0, 0)" }],
});

const generation3 = new Generation({
  locationName: "Mile End",
  location: {
    type: "Point",
    coordinates: [-0.033467, 51.524679],
  },
  time: new Date("2023-03-10T12:00:00"),
  description: "Relaxing at the cafe",
  CA: [{ pattern: "beacon", x: 5, y: 5, color: "rgb(0, 255, 0)" }],
});

const generation4 = new Generation({
  locationName: "Whitechapel",
  location: {
    type: "Point",
    coordinates: [-0.06041, 51.519126],
  },
  time: new Date("2023-02-28T16:45:00"),
  description: "Exploring the market",
  CA: [{ pattern: "toad", x: 5, y: 5, color: "rgb(0, 0, 255)" }],
});

// Save the documents to the database
const insertData = async () => {
  try {
    await generation1.save();
    console.log("Generation 1 saved!");

    await generation2.save();
    console.log("Generation 2 saved!");
    await generation3.save();

    console.log("Generation 3 saved!");
    await generation4.save();

    console.log("Generation 4 saved!");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

insertData();
