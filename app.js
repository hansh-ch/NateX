const express = require("express");
const morgan = require("morgan");
const app = express();

// middleware
app.use(morgan("dev"));

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
