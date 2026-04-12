const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const crypto = require("crypto")
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const createJWTToken = function (id) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    return token;
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
        next(new AppError("Signup failed", 404))
    }
    // Creating token
    const token = createJWTToken(user._id)
    if (!token) {
        next(new AppError("Signup failed", 404));
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
    if (!email || !password) return next(new AppError("Invalid email or password", 400));
    // Check if email exists or user is already signed up
    const user = await User.findOne({ email }).select("+password")
    if (!user) return next(new AppError("Invalid email or password", 400));

    const iscorrect = await user.isPasswordCorrect(password, user.password);
    if (!iscorrect) return next(new AppError("Incorrect email or password", 400));
    const token = createJWTToken(user._id);

    res.status(201).json({
        status: "success",
        token,
    })
})



/*====>    
Desc : Fetch all user
Route: users/
Access: private
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
    if (!token) return next(new AppError("You are not authenticated! Please login", 401))

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
    if (!user) return next(new AppError("User doesn't exist", 401))

    // checking if password is changed after token is issued
    const isChanged = user.isPasswordChangedAfter(decoded.iat)
    if (isChanged) return next(new AppError("User recently changed password!, please login again", 401))
    req.user = user
    next();
})


/*====>    
Desc :Middleware to restrict operations to normal users
<====*/
exports.restrictTo = (...roles) => {
    return function (req, res, next) {
        // roles :["admin","lead-guide","user"]
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't have permission to perform this action", 403))
        };
        next();
    }
};


/*====>    
Desc : User can generate password if he/she forgets password
Route: users/forgot-password
Access: public
<====*/
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new AppError("Invalid email or account doesn't exist", 404));
    const resetToken = user.generatePasswordResetToken();
    // bypassing validators 
    await user.save({ validateBeforeSave: false })
    // Sending token to user email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {

        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 5 min)",
            message,
        });
        res.status(201).json({
            status: "success",
            message: "Token sent to mail"
        })
    } catch (err) {
        // If email fails, reset the DB fields
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError("Error sending email. Try again later.", 500))
    }
})

/*====>    
Desc : Reset user password
Route: users/reset-password/:token
Access: public
<====*/

exports.resetPassword = catchAsync(async (req, res, next) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) return next(new AppError("Token invalid or expired", 400));
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // Sending jwt token to user
    const jwtToken = createJWTToken(user._id);
    res.status(201).json({
        status: "success",
        token: jwtToken,
    })
})

/*====>    
Desc : Update user password
Route: users/update-password
Access: private
<====*/

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = req.user;
    if (!user) return next(new AppError("You are not logged in! Please log in", 401));
    const currUser = await User.findById(user._id).select("+password");
    if (!currUser) return next(new AppError("You are not logged in! Please log in", 401));

    // Validating old password
    const isPasswordMatched = await currUser.isPasswordCorrect(req.body.currentPassword, currUser.password);
    if (!isPasswordMatched) return next(new AppError("Incorrect password", 401));

    // Setting new password
    currUser.password = req.body.newPassword;
    currUser.confirmPassword = req.body.newPasswordConfirm;
    await currUser.save();

    const jwtToken = createJWTToken(currUser._id);
    res.status(201).json({
        status: "success",
        token: jwtToken,
    })
})