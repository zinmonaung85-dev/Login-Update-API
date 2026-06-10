const RegisterDto = require("../dtos/register-api.dto");
const LoginDto = require("../dtos/login-api.dto");
const RefreshTokenDto = require("../dtos/refresh-token.dto");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");



async function register(req, res) {
  try {
    const body = req.body;

    const input = RegisterDto.parse(body);

    console.log(input);

    const createdUser = await authService.register(input);

    const otp = await userService.createOtp(createdUser.email, createdUser.id);

    sendMail({
      email: createdUser.email,
      code: otp.code,
    });

    return res.status(201).json({
      data: { id: createdUser.id },
      message: "Account created successfully! Please verify eamil...",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}


async function login(req, res) {
  try {
    const body = req.body;

    const input = LoginDto.parse(body);

    const token = await authService.login(input);

    return res.json({ data: token, message: "Logined successfully!" });
  } catch (err) {
    handleErrors(res, err);
  }
}


async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;  //const refreshToken =RefreshTokenDto.parse(body);

    const data = await authService.refreshAccessToken(refreshToken);

    return res.status(200).json({
      data,
      message: "Access token generated successfully",
    });

  } catch (err) {
    handleErrors(res, err);
  }
}


async function getMe(req, res) {
  try {
    const userId = req.user.id;
    console.log("Retrieved userId from middleware:", userId);

    const user = await authService.getMe(userId);

    return res.status(200).json({
      userInformation: {
        id: user.id,
        name: user.name,
        createdAt: user.created_at,
      },
      message: "Retrieved User Information successfully!",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = { register, login, refreshAccessToken, getMe };
