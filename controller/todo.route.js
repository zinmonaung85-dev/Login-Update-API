const express = require("express");
const router = express.Router();
const todoContoller = require("./todo.controller");

const { authMiddleware, } = require("../middlewares/auth.middleware");

router.post("/todo", authMiddleware, todoContoller.createTodo);
router.get("/todo", authMiddleware, todoContoller.getTodo);
router.put("/todo/:id", authMiddleware, todoContoller.updateTodo);
router.delete("/todo/:id", authMiddleware, todoContoller.deleteTodo);


module.exports = { router };
