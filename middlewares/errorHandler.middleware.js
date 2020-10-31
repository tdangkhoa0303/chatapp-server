const AppError = require("../utils/AppError");

const handleCastErrorDB = (error) =>
  new AppError(`Invalid ${error.path}: ${error.value}.`, 400);

const sendErrorProd = ({ isOperational, status, message }, res) => {
  if (isOperational) {
    res.status(statusCode).json({
      status: status,
      message: message,
    });
  } else
    res.status(500).json({
      status: "error",
      message: "Something went wrong 🙃",
    });
};

module.exports = (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || 500,
    status: err.status || "error",
    ...err,
  };

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (process.env.NODE_ENV === "production") sendErrorProd(error, res);
  else
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
};
