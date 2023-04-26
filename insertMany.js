const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Generation = require("./models/Generation");
const myPatterns = require("./patterns");

const app = express();
app.use(cors());
app.use(express.json());

//Setup mongoDB connection string
const mongoURI =
  "mongodb+srv://hrubaanna1:abpISb7recN0BXvq@cluster0.irqh343.mongodb.net/generations?retryWrites=true&w=majority";

//Connect to mongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//write a function that will insert many documents into the database

let usersArr = ["user1", "anna"];
//create an array of locations in London, UK, like park names, street names, and so on
let locationArr = [
  "Victoria Park",
  "Hackney",
  "Camden",
  "Mile End",
  "Whitechapel",
  "Borough",
  "Shoreditch",
  "Bethnal Green",
  "Hoxton",
  "Islington",
  "Kings Cross",
  "Stoke Newington",
  "Stratford",
  "Walthamstow",
  "Wandsworth",
  "Westminster",
  "Wimbledon",
  "Wood Green",
  "Woodford",
  "Woolwich",
  "Worcester Park",
  "Wormwood Scrubs",
  "Worthing",
];
let timeArr = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
let descriptionArr = [
  "A beautiful day in the park",
  "Finding books in the library",
  "Sunny afternoon by the lake",
  "Relaxing at the cafe",
  "Exploring the market",
  "A nice day in the park",
];

const getCoordinates = () => {
  const minX = 51.53;
  const maxX = 51.541;
  const minY = -0.087;
  const maxY = -0.066;
  //get random range between minX and maxX
  let randomX = Math.random() * (maxX - minX) + minX;
  //get random range between minY and maxY
  let randomY = Math.random() * (maxY - minY) + minY;
  //push the random coordinates to the array
  return [randomY, randomX];
};

const getTime = () => {
  //get a random date within the last 2 months
  const date = new Date(Date.now() - Math.random() * 12096e5);
  return date;
};

const getRandomPattern = () => {
  //get a random pattern from myPatterns array
  const randomPattern =
    myPatterns.patternNames[
      Math.floor(Math.random() * myPatterns.patternNames.length)
    ];
  console.log("randomPattern: ", randomPattern);
  //get the x and y value of the pattern
  const x = myPatterns.patternSaveLocations[randomPattern][0];
  const y = myPatterns.patternSaveLocations[randomPattern][1];
  console.log("x: ", x);
  console.log("y: ", y);
  //get a random color as rgb()
  const colorString = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)})`;
  console.log("colorString: ", colorString);
  //return an object with the pattern, x, y and color
  const pattern = {
    pattern: randomPattern,
    x: x,
    y: y,
    color: colorString,
  };
  console.log(pattern);
  return pattern;
};

const getRandomGeneration = () => {
  //get a random location from the location array
  const locationName =
    locationArr[Math.floor(Math.random() * locationArr.length)];
  //get a random time from the time array
  const time = timeArr[Math.floor(Math.random() * timeArr.length)];
  //get a random description from the description array
  const description =
    descriptionArr[Math.floor(Math.random() * descriptionArr.length)];
  //get random coordinates
  const coordinates = getCoordinates();
  //get random time
  const date = getTime();
  //get random pattern
  const pattern = getRandomPattern();
  //return an object with the location, time, description, coordinates and pattern
  const user = usersArr[Math.floor(Math.random() * usersArr.length)];
  return {
    locationName: locationName,
    location: {
      type: "Point",
      coordinates: coordinates,
    },
    time: date,
    description: description,
    user: user,
    CA: [pattern],
  };
};

const generation1 = new Generation({
  location: "Hackney",
  time: "Monday",
  description: "A beautiful day in the park",
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
  location: "Camden",
  time: "Friday",
  description: "test",
  CA: [{ pattern: "loaf", x: 5, y: 5, color: "rgb(266, 15, 20)" }],
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
    //save 10 generations
    for (let i = 0; i < 100; i++) {
      const generation = new Generation(getRandomGeneration());
      console.log(generation);
      await generation.save();
      console.log(`Generation ${i + 1} saved!`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

insertData();
