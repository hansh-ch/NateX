const express = require("express");
const morgan = require("morgan");
const qs = require("qs"); 
const appError = require("./utils/appError"); 
const app = express();





// middlewares
app.use(morgan("dev"));
app.use(express.json());

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./utils/errorController");

// ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handling undefined routes if doesn't matches above routes
app.all("*",(req,res,next)=>{
    res.status(404).json({
        status:"fail",
        message:`Can't find ${req.originalUrl} on this server!`
    })   
})

// ERROR HANDLING
app.use(errorHandler)

module.exports = app;

