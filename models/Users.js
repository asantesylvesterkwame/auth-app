const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("auth-practice-users", userModel);
