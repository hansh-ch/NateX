const qs = require("qs");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xssSanitize = require("xss-sanitize")
const hpp = require("hpp")


const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 100, // Limit each IP to 100 requests per `window`.
    message: "To many request from this IP, please try after 1 hour",
})

// middlewares
app.use("/api", limiter)
app.use(express.json({
    limit: "10kb"
}));
app.use(cookieParser());
app.use(mongoSanitize())
app.use(xssSanitize())
// Prevent parameter pollution
app.use(hpp({
    whitelist: ["duration", "price", "ratingsQuantity", "maxGroupSize", "ratingsAverage"]
}))
// Serving static files
app.use(express.static(`${__dirname}/public`));


const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./controllers/errorController");

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handling undefined routes if doesn't matches above routes
app.all("*", (req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server!`
    })
})

// ERROR HANDLING
app.use(errorHandler)

module.exports = app;

