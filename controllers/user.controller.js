const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");
const factory = require("../factory");
const AppError = require("../utils/AppError");
const { basicDetails } = require("../utils/user.utils");

module.exports.searchUsers = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  const users = await User.find({
    $or: [
      {
        firstName: { $regex: new RegExp(`${q}`, "i") },
      },
      {
        lastName: { $regex: new RegExp(`.${q}.`, "i") },
      },
    ],
  }).select("fullName _id email avatar firstName lastName");
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

module.exports.getProfile = catchAsync(async (req, res, next) => {
  try {
    const { q } = req.query;
    const user = await factory.queryUser(q);
    if (!user) return new AppError("User not found", 404);

    const posts = await factory.getPosts(1, user._id);

    res.status(200).json({
      status: "sucess",
      data: {
        user: {
          ...basicDetails(user),
          posts,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
});
