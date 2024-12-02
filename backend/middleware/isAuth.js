const UserModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuth = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resourse", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await UserModel.findById(decodedData.id);
  next();
});
