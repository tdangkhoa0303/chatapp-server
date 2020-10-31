const catchAsync = require("../utils/catchAsync");
const User = require("../models/user.model");

module.exports.createUser = catchAsync((req, res, next) => {});

module.exports.searchUsers = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  const users = User.find({ fullName: { $regex: q, $option: "i" } });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});
