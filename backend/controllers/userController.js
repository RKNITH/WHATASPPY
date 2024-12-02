const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const UserModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const sendToken = require("../utils/sendToken");

exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  const checkEmail = await UserModel.findOne({ email });

  if (checkEmail) {
    return res.status(400).json({
      message: "User already exists",
      error: true,
    });
  }

  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt);

  const user = new UserModel({
    name,
    email,
    password: hashPassword,
    profilePic,
  });

  const userSave = await user.save();

  return res.status(201).json({
    message: "user created successfully",
    user: userSave,
    success: true,
  });
});

// login
exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "user not exist",
      error: true,
    });
  }

  const verifyPassword = await bcryptjs.compare(password, user.password);

  if (!verifyPassword) {
    return res.status(400).json({
      message: "wrong password",
      error: true,
    });
  }

  sendToken(user, 200, res);
});

// logout
exports.logout = catchAsyncErrors(async (req, res) => {
  const cookieOptions = {
    http: true,
    secure: true,
    samesite: "None",
  };

  return res.cookie("token", "", cookieOptions).status(200).json({
    message: "logout successfully",
    succes: true,
  });
});

// user details
exports.userDetails = catchAsyncErrors(async (req, res) => {
  return res.status(200).json({
    message: "user details",
    user: req.user,
  });
});

// update user
exports.updateUser = catchAsyncErrors(async (req, res) => {
  const { userId, name, profilePic } = req.body;

  const updateuser = await UserModel.updateOne(
    { _id: userId },
    { name, profilePic }
  );
  console.log(updateuser, "updateuser");

  if (updateuser?.modifiedCount == 1) {
    const user = await UserModel.findById(userId);

    return res.status(200).json({
      message: "user udpated successfully",
      user,
      success: true,
    });
  } else {
    return res.status(400).json({
      message: "user not udpated",
      error: true,
    });
  }
});

// search user
exports.searchUser = catchAsyncErrors(async (req, res) => {
  const { search } = req.body;

  const query = new RegExp(search, "i", "g");
  const users = await UserModel.find({
    $or: [{ name: query }, { email: query }],
  }).select("-password");
  console.log(users, "users");

  return res.status(200).json({
    message: "all users",
    users,
    success: true,
  });
});
