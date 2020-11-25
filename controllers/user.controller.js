const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");

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
