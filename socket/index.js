const socketIO = require("socket.io");
const _ = require("underscore");
const events = require("./events");

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

const onlineUsers = () => {
  let tmp = {};
  Object.values(users).forEach((e) => (tmp[e._id] = e));
  return tmp;
};

exports.initialize = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "https://chatwithkeen.netlify.app",
      credentials: true,
    },
    cookie: false,
  });
  const nsp = io.of("/messenger");

  io.on(events.CONNECT, (socket) => {
    console.log(socket);
  });

  nsp.on(events.MESSAGE, (socket) => console.log("a"));

  nsp.on(events.CONNECT, (socket) => {
    socket.auth = false;
    socket.on(events.AUTHENTICATE, async ({ token }) => {
      if (token) {
        try {
          const {
            data: { _id: userId },
          } = await verifyToken(token, accessTokenSecret);

          const user = basicDetails(await await User.findOne({ _id: userId }));
          if (!user) return;

          socket.auth = true;
          socket.userId = user._id;

          // Restore authenticated socket to its namespace
          if (_.findWhere(nsp.sockets, { id: socket.id })) {
            nsp.connected[socket.id] = socket;
            users[socket.id] = user;
            socket.join(user._id);
            nsp.emit(events.UPDATE, onlineUsers());
          }
        } catch (err) {
          socket.auth = false;
          console.log(err);
        }
      }
    });

    setTimeout(() => {
      if (!socket.auth) socket.disconnect("unauthenticate");
    }, 1000);

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
      nsp.emit(events.UPDATE, onlineUsers());
    });
  });
};
