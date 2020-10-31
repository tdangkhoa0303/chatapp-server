const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (email) => {
          const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return emailPattern.test(email);
        },
        message: "Invalid email",
      },
    },

    password: {
      type: String,
      require: [true, "Password is requied."],
    },
    avatar: {
      type: String,
      trim: true,
      defualt:
        "https://grantland.com/wp-content/uploads/2015/07/minions_behind.jpg?w=1280",
    },
    conversations: {
      type: [mongoose.Schema.ObjectId],
      ref: "Conversation",
    },
    socketId: {
      type: String,
      trim: true,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
