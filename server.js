const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Environment = require("./Environment");

const app = express();
app.use(cors());
app.use(express.json());

//Setup mongoDB connection string
const mongoURI = Environment.MONGODB_URI;

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

//Setup port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
