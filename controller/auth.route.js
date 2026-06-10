const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const userController = require("./user.controller");

const { authMiddleware, } = require("../middlewares/auth.middleware");

//auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshAccessToken);
router.get("/me", authMiddleware, authController.getMe);

router.post("/send-otp", authMiddleware, userController.sendOtp);
router.post("/verify-email", userController.verifyEmail);
router.post("/change-email", authMiddleware, userController.updateEmail);

module.exports = { router };
