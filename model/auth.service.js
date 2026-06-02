const { DB } = require("./database");
const UserModel = require("./user.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const ApiError = require("../controller/api-error");
const { signJWT } = require("./jwt");

const db = DB.create();

async function register(input) {
  const pool = db.pool();

  const findByEmailResult = await pool.query({
    name: "check-email-duplicate",
    text: "SELECT * FROM users WHERE email = $1",
    values: [input.email],
  });

  if (findByEmailResult.rows.length > 0) {
    throw new ApiError("Duplicate email", 400);
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    await bcrypt.genSalt(10),
  );
  const user = new UserModel(
    uuidv4(),
    input.name,
    input.email,
    hashedPassword,
    new Date(),
  );


  await pool.query({
    name: "create-user",
    text: "INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    values: [
      user.id,
      user.name,
      user.email,
      user.password,
      false,
      user.createdAt,
      "pending",
    ],
  });

  return user;
  
}

async function login(input) {
  const pool = db.pool();

  const findByEmailResult = await pool.query({
    name: "check-email-duplicate",
    text: "SELECT * FROM users WHERE email = $1",
    values: [input.email],
  });
  if (findByEmailResult.rows.length < 1) {
    throw new ApiError("User not found", 400);
  }
  const foundUser = findByEmailResult.rows[0];
  if(foundUser.status !== "active"){
    throw new ApiError("Please verify your email first!", 400);
  }

  const isSame = await bcrypt.compare(input.password, foundUser.password);
  if (!isSame) {
    throw new ApiError("Password not match", 400);
  }

  const token = signJWT({ id: foundUser.id });
  return token;
}

module.exports = { register, login };
