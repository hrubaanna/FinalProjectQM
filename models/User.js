const mongoose = require("mongoose");

//MongoDB schema for a user
//a user is created during registration and their username is used to identify their creations

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
