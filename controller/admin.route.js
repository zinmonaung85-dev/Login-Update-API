const express = require("express");
const router = express.Router();

const adminController = require("./admin.controller");
const role = require("../model/role.model");

const { adminMiddleware } = require("../middlewares/admin-jwt.middleware");
const { permissionMiddleware } = require("../middlewares/permission.middleware");

// admins
router.post("/login", adminController.login);
router.post("/invite", adminController.invite);
router.put("/change-password", adminController.changePassword);
router.get("/users", adminMiddleware, adminController.getUserList);
router.delete("/users/:userId", adminMiddleware, permissionMiddleware([role.SUPER_ADMIN, role.ADMIN]), adminController.deleteUser);

module.exports = { router };