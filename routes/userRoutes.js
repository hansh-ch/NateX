const express = require("express");
const { signupUser, loginUser, getAllUser } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/", getAllUser);
module.exports = router;
