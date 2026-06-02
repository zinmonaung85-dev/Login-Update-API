const { DB } = require("./database");
const UserModel = require("./user.model");
const TodoModel = require("./todo.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const ApiError = require("../controller/api-error");
const { signJWT } = require("./jwt");

const db = DB.create();

async function createTodo(input) {
  const pool = db.pool();

  const result = await pool.query(
    `
    INSERT INTO todos(id, title, description, created_at, user_id)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      uuidv4(),
      input.title,
      input.description || null,
      new Date(),
      input.userId,
    ]
  );

  return result.rows[0];
}

async function getTodo(userId) {
  const pool = db.pool();

  const result = await pool.query(
    `
    SELECT *,
           COUNT(*) OVER() AS total_count
    FROM todos
    WHERE user_id = $1
    ORDER BY created_at DESC
    `, [userId]
  );

  return result.rows;
}


module.exports = { createTodo, getTodo };
