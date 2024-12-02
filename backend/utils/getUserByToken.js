const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getUserByToken = async (token) => {
  if (!token) {
    return {
      message: "token expired",
      logout: true,
    };
  } else {
    const decode = jwt?.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decode.id).select("-password");
    return user;
  }
};
module.exports = getUserByToken;
