const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

const filterObject = function (obj, ...allowedFields) {
    const newObj = {};
    const filtered = Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;

}

/*====>    
Desc : Update user data
Route: users/updateme
Access: private
<====*/
exports.updateUser = catchAsync(async (req, res, next) => {
    // Create error if user wants to update password
    if (req.body.password || req.body.confirmPassword) return next(new AppError("This route is not for updating password", 404));

    // Filtering fields
    const data = filterObject(req.body, "name", "email");
    const user = await User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true });
    if (!user) return next(new AppError("No user found with that ID", 404));

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})


/*====>    
Desc : Delete user 
Route: users/deleteme
Access: private
<====*/

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, { isActive: false });
    if (!user) return next(new AppError("Cannot delete account", 400))
    res.status(200).json({
        status: "success"
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
