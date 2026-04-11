const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { promisify } = require("util")
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync")
const appError = require("../utils/appError")

const createJWTToken = function (id) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token
}

/*====>    
Desc : Signup new user
Route: users/signup
Access: public
<====*/
exports.signupUser = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, photo, passwordChangedAt } = req.body
    const user = await User.create({ name, email, password, confirmPassword, photo, passwordChangedAt });
    if (!user) {
        next(new appError("Signup failed", 404))
    }
    // Creating token
    const token = createJWTToken(user._id)
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



/*====>    
Desc : Login user
Route: users/login
Access: public
<====*/

exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new appError("Invalid email or password", 400));
    // Check if email exists or user is already signed up
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new appError("Invalid email or password", 400));

    const iscorrect = await user.isPasswordCorrect(password, user.password,);
    if (!iscorrect) return next(new appError("Incorrect email or password", 400));
    const token = createJWTToken(user._id);

    res.status(201).json({
        status: "success",
        token,
    })
})



/*====>    
Desc : Fetch all user
Route: users/
Access: public
<====*/

exports.getAllUser = catchAsync(async (req, res, next) => {

    const users = await User.find();
    res.status(201).json({
        status: "success",
        data: {
            users
        }
    })
})

/*====>    
Desc : protect authentication
<====*/
exports.protectAuth = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers?.authorization?.split(" ")[1]
    }
    if (!token) return next(new appError("You are not authenticated! Please login", 401))

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
    if (!user) return next(new appError("User doesn't exist", 401))

    // checking if password is changed after token is issued
    const isChanged = user.isPasswordChangedAfter(decoded.iat)
    if (isChanged) return next(new appError("User recently changed password!, please login again", 401))
    req.user = user
    next();
})