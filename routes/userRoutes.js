const express = require("express");
const { signupUser, loginUser, forgotPassword, resetPassword, protectAuth, updatePassword } = require("../controllers/authController");
const { updateUser, deleteMe, getAllUser } = require("../controllers/userController");
const router = express.Router();

// AUTH ROUTES
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protectAuth, updatePassword);

// USER ROUTES
router.patch("/updateme", protectAuth, updateUser)
router.delete("/deleteme", protectAuth, deleteMe)
router.get("/", getAllUser);


module.exports = router;
