const { DB } = require("./database");
const UserModel = require("./user.model");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const ApiError = require("../controller/api-error");
//const { signJWT } = require("./jwt");
const { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, } = require("./jwt");

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

  if (foundUser.status !== "active") {
    throw new ApiError("Please verify your email first!", 400);
  }

  const isSame = await bcrypt.compare(input.password, foundUser.password);
  if (!isSame) {
    throw new ApiError("Password not match", 400);
  }


  const accessToken = signAccessToken(
    {
      id: foundUser.id,
      email: foundUser.email,
    }, "15m");

  const refreshToken = signRefreshToken(
    {
      id: foundUser.id,
    }, "7d");

  return {
    accessToken,
    refreshToken,
    user: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
    },
  };
}


async function refreshAccessToken(refreshToken) {

  if (!refreshToken) {
    throw new ApiError("Refresh token is required", 400);
  }

  try {
    const user = verifyRefreshToken(refreshToken);

    const accessToken = signAccessToken(
      {
        id: user.id,
      }, "15m");

    return {
      accessToken,
    };

  } catch (err) {
    throw new ApiError("Invalid refresh token", 401);
  }
}


async function getMe(userId) {

  console.log(userId);
  const pool = db.pool();

  const findUserByIdResult = await pool.query({
    name: "find-user-by-id-v4",
    text: "SELECT id, name, created_at FROM users WHERE id = $1",
    values: [userId],
  });

  if (findUserByIdResult.rows.length === 0) {
    throw new ApiError("User not found", 400);
  }

  const foundUser = findUserByIdResult.rows[0];

  return foundUser;
}


module.exports = { register, login, refreshAccessToken, getMe };
