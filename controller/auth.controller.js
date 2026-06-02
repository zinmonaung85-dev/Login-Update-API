const RegisterDto = require("../dtos/register-api.dto");
const LoginDto = require("../dtos/login-api.dto");
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

    const otp = await userService.createOtp(createdUser.email,createdUser.id);

    await sendMail({ 
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

module.exports = { register, login };
