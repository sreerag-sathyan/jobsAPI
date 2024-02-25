const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user should have a name"],
  },
  password: {
    type: String,
    required: [true, "A user should have a password"],
    select: false
  },
  email: {
    type: String,
    required: [true, "A user should have a password"],
    unique: [true, "The email is already in use"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "The email is invalid",
    ],
  },
});

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

userSchema.methods.signJWT = async function () {

  const token = await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  return token
};

userSchema.methods.verifyPassword = async function(pwd){

    const isMatching = await bcrypt.compare(pwd, this.password)
    return isMatching
}

const User = mongoose.model("User", userSchema);

module.exports = User;
