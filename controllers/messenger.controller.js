const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");

module.exports.getConversations = catchAsync(async (req, res, next) => {
  const perPage = 10;
  const page = req.query.page || 1;

  if (page < 1) return res.status(200).json([]);

  const conversations = await Conversation.find({ members: req.user._id })
    .limit(perPage)
    .skip(perPage * (page - 1))
    .sort("date");

  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});

module.exports.getSingleConversation = catchAsync(async (req, res, next) => {
  const { q } = req.params;
  const user = await User.findById(req.jwtDecoded.data._id);
  const { _id: recieverId } = await User.findOne({
    $or: [{ userName: q }, { _id: q }],
  });

  if (!recieverId) return next(new AppError("Unavailable conversation.", 404));

  let conversation = await Conversation.findOne({
    members: { $size: 2, $all: [recieverId, userId] },
  });

  if (!conversation)
    conversation = await Conversation.create({
      members: [recieverId, userId],
      messages: [],
    });

  res.status(200).json({
    stauts: "succes",
    data: {
      conversation,
    },
  });
});
