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
app.use((err,req,res,next)=>{
    err.statusCode= err.statusCode || 500,
    err.status= err.status || "error",
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

module.exports = app;

