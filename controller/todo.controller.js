const CreateTodoDto = require("../dtos/create-todo.dto");
const GetTodoDto = require("../dtos/get-todo.dto");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const todoService = require("../model/todo.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");

async function createTodo(req, res) {
  try {
    const body = req.body;

    const input = CreateTodoDto.parse(body);

    const todo = await todoService.createTodo({
      title: input.title,
      description: input.description,
      userId: req.user.id,
    });

    return res.status(201).json({
      data: todo,
      message: "Todo created successfully",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}


async function getTodo(req, res) {
  try {
    const todos = await todoService.getTodo(req.user.id);

    return res.status(200).json({
      data: todos,
      message: "Todos fetched successfully",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = { createTodo, getTodo };
