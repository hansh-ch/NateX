const express = require("express");
const { signupUser, loginUser, getAllUser, forgotPassword, resetPassword, protectAuth, updatePassword } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.patch("/update-password", protectAuth, updatePassword);
router.get("/", getAllUser);
module.exports = router;
