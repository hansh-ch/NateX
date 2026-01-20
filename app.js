const express = require("express");
const morgan = require("morgan");
const qs = require("qs");
const app = express();


// Configure query parser to support nested objects
app.set("query parser", (str) => {
  return qs.parse(str, { allowDots: true, depth: 10 });
});

// middlewares
app.use(morgan("dev"));
app.use(express.json());

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;

