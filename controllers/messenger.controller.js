const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");
const { getConversations } = require("../factory");
module.exports.getConversations = catchAsync(async (req, res, next) => {
  const page = req.query.p || 1;
  const user = req.jwtDecoded.data;

  if (page < 1) return res.status(200).json([]);
  const conversations = await getConversations(user, page);

  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});

module.exports.getSingleConversation = catchAsync(async (req, res, next) => {
  const { q } = req.params;
  const user = await User.findById(req.jwtDecoded.data._id).populate({
    path: "conversations",
    populate: [
      {
        path: "members",
        select: "fullName _id email avatar firstName lastName",
        populate: {
          path: "avatar",
          select: "url",
        },
      },
      { path: "messages" },
    ],
  });

  const { _id: recieverId } = await User.findOne({
    $or: [{ userName: q }, { _id: q }],
  });

  if (!recieverId) return next(new AppError("Unavailable conversation.", 404));

  let conversation = await user.conversations.find((conversation) => {
    const tmp = [user._id, recieverId].sort().join("");
    const members = conversation.members
      .map((e) => e._id)
      .sort()
      .join("");
    return tmp === members;
  });

  if (!conversation) {
    conversation = await Conversation.create({
      members: [recieverId, user._id],
      messages: [],
    });

    conversation = await Conversation.findById(conversation._id).populate({
      path: "members",
      populate: {
        path: "avatar",
        select: "url",
      },
    });

    const members = Array.from(new Set(conversation.members));

    members.forEach(async (member) => {
      await User.findByIdAndUpdate(member._id, {
        $addToSet: { conversations: conversation._id },
      });
    });
  }

  res.status(200).json({
    stauts: "success",
    data: { conversation },
  });
});

module.exports.getConversationById = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const conversation = (await Conversation.findById(id)).populate([
    { path: "members", select: "fullName _id email avatar firstName lastName" },
    { path: "messages" },
  ]);

  if (!conversation) return new AppError("No conversation found!", 404);

  res.status(201).json({
    status: "success",
    data: {
      conversation,
    },
  });
});

module.exports.seenConversation = catchAsync(async (req, res, next) => {
  const { id, seen } = req.body;

  if (!id) return new AppError("Conversation not found", 404);

  const conversation = await Conversation.findByIdAndUpdate(id, {
    seen: seen || true,
  });
  res.status(200).json({
    status: "success",
    data: { conversation },
  });
});
