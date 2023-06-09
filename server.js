const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//const Environment = require("./Environment");

/****
 * The server.js was user to test the backend routes and database connection.
 */

const app = express();
app.use(cors());
app.use(express.json());

//Setup mongoDB connection string
//const mongoURI = Environment.MONGODB_URI;

//for use with heroku:
const mongoURI = process.env.MONGODB_URI;

//Connect to mongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//Setup routes
const historyRoutes = require("./routes/historyRoutes");
app.use("/historyRoutes", historyRoutes);

const homeRoutes = require("./routes/homeRoutes");
app.use("/homeRoutes", homeRoutes);

const mapRoutes = require("./routes/mapRoutes");
app.use("/mapRoutes", mapRoutes);

const addRoutes = require("./routes/addRoutes");
app.use("/addRoutes", addRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/userRoutes", userRoutes);

//Setup port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
