const jwt = require("jsonwebtoken")
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync")
const appError = require("../utils/appError")

/*====>    
Desc : Signup new user
Route: tours/
Access: public
<====*/
exports.signupUser = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, photo } = req.body
    const user = await User.create({ name, email, password, confirmPassword, photo });
    if (!user) {
        next(new appError("Signup failed", 404))
    }
    // Creating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    if (!token) {
        next(new appError("Signup failed", 404))
    }
    res.status(201).json({
        status: "success",
        token,
        data: {
            user
        }
    })
})