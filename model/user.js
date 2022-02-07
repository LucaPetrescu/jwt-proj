const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: "string", require: true, unique: true },
    password: { type: "string", require: true },
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("UserSchema", UserSchema);

module.exports = model;
