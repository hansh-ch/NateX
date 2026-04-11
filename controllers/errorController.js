const AppError = require("../utils/appError");


function sendProductionError(err, res) {

    // We mark error created or thrown by us as operational as error could happen through 
    // 3rd party library
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        console.log("ERROR⚠️", err.message)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
}

function handleInvalidIdError(e) {
    const message = `Invalid ${e.path}:${e.value}`
    return new AppError(message, 400)
}

function handleDuplicateKeyError(err) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    return new AppError(message, 400)
}

function handleValidationError(err) {
    const message = Object.values(err.errors).map(val => val.message);
    return new AppError(message, 400)
}

function handleInvalidToken() {
    return new AppError("Invalid token", 401)
}

function handleExpiredToken() {
    return new AppError("Token expired ! please login again", 401)
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // Sending different types of error based on environment
    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else if (process.env.NODE_ENV === "production") {
        let error = Object.assign(err);
        error.message = err.message;
        // Handling mongoDB errors
        // Invalid ID
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            error = handleInvalidIdError(error);
        }
        // Duplicate Key Error
        if (err.code === 11000) {
            error = handleDuplicateKeyError(error)
        }

        //  Mongoose Validation Error
        if (err.name === 'ValidationError') {
            error = handleValidationError(error)
        }

        if (err.name === 'JsonWebTokenError') {
            error = handleInvalidToken(error)
        }
        if (err.name === 'TokenExpiredError') {
            error = handleInvalidToken(error)
        }
        sendProductionError(error, res);
    }
}

module.exports = errorHandler