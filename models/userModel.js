const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        maxlength: [30, 'Name must be less than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match!'
        }
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ["user", "admin", "lead-guide"],
        default: "user"
    },
},
    {
        timestamps: true
    });

// Encrypting password before saving
userSchema.pre('save', async function () {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return;
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete confirmPassword field ( not store in database)
    this.confirmPassword = undefined;
});

// Method for checking password -- instance method available on all docs of collection
userSchema.methods.isPasswordCorrect = async function (enteredPassword, hashedPassword) {
    isCorrect = await bcrypt.compare(enteredPassword, hashedPassword,);
    return isCorrect;
}

// Method for checking if password is changed after token is issued
userSchema.methods.isPasswordChangedAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        // conveting date tp milliseconds
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(changedTimestamp, jwtTimestamp);
        return jwtTimestamp < changedTimestamp;
    }
    // false ==> password not changed
    return false;
}

const User = mongoose.model("User", userSchema)
module.exports = User;