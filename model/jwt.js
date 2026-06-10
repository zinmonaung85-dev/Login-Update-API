const jwt = require("jsonwebtoken");

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not provided");
  }

  return secret;
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not provided");
  }

  return secret;
}

function signAccessToken(payload, expiresIn) {
  return jwt.sign(payload, getAccessSecret(), { expiresIn, });
}

function signRefreshToken(payload, expiresIn) {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn, });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken, };