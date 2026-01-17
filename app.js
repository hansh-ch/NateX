const express = require("express");
const morgan = require("morgan");
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
