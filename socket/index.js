const socketIO = require("socket.io");
const _ = require("underscore");
const events = require("./events");
const AppError = require("../utils/AppError");

// Utils
const { basicDetails } = require("../utils/user.utils");

// Models import
const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

// JWT
const { verifyToken } = require("../utils/auth.utils");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

let users = {};

let io;

const initialize = (server) => {
  io = socketIO(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  const nsp = io.of("/messenger");

  nsp.on(events.CONNECT, (socket) => {
    setTimeout(() => {
      if (!socket.auth) socket.disconnect("unauthenticate");
    }, 1000);

    socket.on(events.AUTHENTICATE, async ({ auth: token }) => {
      if (token) {
        try {
          const {
            data: { _id: userId },
          } = await verifyToken(token, accessTokenSecret);

          const user = basicDetails(
            await await User.findOne({ _id: userId }).populate({
              path: "avatar",
              select: "url",
            })
          );

          if (!user) return;

          socket.auth = true;
          socket.userId = user._id;
          // Restore authenticated socket to its namespace

          users[socket.id] = user;
          socket.join(user._id);
          socket.emit(events.UPDATE, users);
          nsp.emit(events.UPDATE, users);
        } catch (err) {
          console.log(err);
          return new AppError("Unauthorized", 401);
        }
      }
    });

    socket.on(events.MESSAGE, async ({ message, conversationId }) => {
      try {
        let conversation = await Conversation.findOne({ _id: conversationId });
        if (!conversation) return;

        if (!conversation.members.includes(socket.userId)) return;

        const newMessage = await Message.create({
          ...message,
          conversation: conversationId,
        });

        conversation = await Conversation.findByIdAndUpdate(conversationId, {
          $push: { messages: newMessage },
        });

        conversation.members.forEach((member) => {
          member !== socket.userId &&
            socket
              .to(member)
              .emit(events.MESSAGE, { conversationId, message: newMessage });
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on(events.DISCONNECT, () => {
      delete users[socket.id];
      nsp.emit(events.UPDATE, users);
    });
  });
};

module.exports = { io, initialize };
