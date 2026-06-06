const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");

const { adminMiddleware, } = require("../middlewares/admin-jwt.middleware");
const { permissionMiddleware, } = require("../middlewares/permission.middleware");


//admins
router.post("/system-login", adminController.login);
router.post("/invite", adminController.invite);
router.put("/change-password", adminController.changePassword);
router.delete("/delete-user/:userId", adminMiddleware, permissionMiddleware, adminController.deleteUser);

module.exports = { router };
