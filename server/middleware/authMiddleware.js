
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const token = req.cookies?.taskflow_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (
      typeof decoded.sub !== "string" ||
      !mongoose.isValidObjectId(decoded.sub)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    next(error);
  }
}

module.exports = { protect };
