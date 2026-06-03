const CreateTodoDto = require("../dtos/create-todo.dto");
const GetTodoDto = require("../dtos/get-todo.dto");
const UpdateTodoDto = require("../dtos/update-todo.dto");
const DeleteTodoDto = require("../dtos/delete-todo.dto");
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


async function updateTodo(req, res) {
  try {
    const todoId = req.params.id;

    const updatedTodo = await todoService.updateTodo(
      todoId,
      req.user.id,
      {
        title: req.body.title,
        description: req.body.description,
      }
    );

    return res.status(200).json({
      data: updatedTodo,
      message: "Todo updated successfully",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function deleteTodo(req, res) {
  try {
    const input = DeleteTodoDto.parse({ id: req.params.id });

    const deletedTodo = await todoService.deleteTodo(
      input.id,
      req.user.id
    );

    return res.status(200).json({
      data: deletedTodo,
      message: "Todo delete successfully!",
    });

  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = { createTodo, getTodo, updateTodo, deleteTodo };
