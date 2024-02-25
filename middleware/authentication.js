const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new BadRequestError("Bad request");
  }

  const token = authorization.split(" ")[1];

  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedToken.id;
    next()
  } catch (error) {
    throw new UnauthenticatedError("Invalid or expired token");
  }
};


module.exports = auth