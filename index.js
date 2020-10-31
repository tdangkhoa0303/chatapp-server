require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AppError = require("./utils/AppError");
const Socket = require("./socket");

const PORT = process.env.PORT || 1402;

// Middlewares
const errorHandler = require("./middlewares/errorHandler.middleware");
const { isAuth } = require("./middlewares/auth.middleware");

//Routes
const authRoute = require("./routes/auth.route");
const messengerRoute = require("./routes/messenger.route");

const app = express();
const server = app.listen(PORT, () => console.log(`Hello from ${PORT}`));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SIGNED_SECRET));
app.use(express.static("./public"));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  dbName: "Chatapp",
});

Socket.initialize(server);

app.use("/auth", authRoute);
app.use("/messenger", isAuth, messengerRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);
