const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const todoContoller = require("./todo.controller");
const userController = require("./user.controller");
const adminController = require("./admin.controller");

const { authMiddleware, } = require("../middlewares/auth.middleware");
const { adminMiddleware, } = require("../middlewares/admin-jwt.middleware");
const { permissionMiddleware, } = require("../middlewares/permission.middleware");

//users
router.post("/register", authController.register);
router.post("/login", authController.login);


//admin
router.post("/system-login", adminController.login);
router.post("/invite", adminController.invite);
router.put("/change-password", adminController.changePassword);
router.delete("/delete-user/:userId", adminMiddleware, permissionMiddleware, adminController.deleteUser);

//auth
router.post("/todo", authMiddleware, todoContoller.createTodo);
router.get("/todo", authMiddleware, todoContoller.getTodo);
router.put("/todo/:id", authMiddleware, todoContoller.updateTodo);
router.delete("/todo/:id", authMiddleware, todoContoller.deleteTodo);

//users
router.post("/send-otp", authMiddleware, userController.sendOtp);
router.post("/verify-email", userController.verifyEmail);
router.post("/change-email", authMiddleware, userController.updateEmail);

module.exports = { router };
