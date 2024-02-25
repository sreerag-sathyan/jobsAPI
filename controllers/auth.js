const { UnauthenticatedError } = require("../errors");
const BadRequestError = require("../errors/bad-request");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = new User(req.body);

  if (!user) {
    throw new BadRequestError("Bad request");
  }

  const token = await user.signJWT();
  await user.save();

  res.status(StatusCodes.CREATED).json({ msg: "Success", data: user, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select('password');
  if(!user){
    throw new UnauthenticatedError('No such user')
  }
  const isUserValid = await user.verifyPassword(password);
  if (!isUserValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = await user.signJWT()
  res.status(StatusCodes.ACCEPTED).json({ data: user , token});
};

module.exports = {
  register,
  login,
};
