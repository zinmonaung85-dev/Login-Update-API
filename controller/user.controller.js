const RegisterDto = require("../dtos/register-api.dto");
const UpdateEmailDto = require("../dtos/update-email.dto");
const VerifyEmailDto = require("../dtos/verify-email-api.dto");
const SendOtpDto = require("../dtos/send-otp.dto");
const userService = require("../model/user.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");


async function sendOtp(req, res) {
  try {
    const body = req.body;

    const input = SendOtpDto.parse(body);

    const otp = await userService.createOtp(input.email, req.user.id);

    sendMail({ email: input.email, code: otp.code });

    return res.status(201).json({
      data: {},
      message: "Otp successfully send to email",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

async function verifyEmail(req, res) {

  try {

    const body = req.body;

    const input = VerifyEmailDto.parse(body);

    const foundOtp = await userService.findOtp(
      input.code
    );

    await userService.activateUser(foundOtp.user_id);

    await userService.deleteOtp(foundOtp.id);

    return res.status(200).json({
      data: {},
      message:
        "Email verified successfully!",
    });

  } catch (err) {
    handleErrors(res, err);
  }
}


async function updateEmail(req, res) {
  try {
    const body = req.body;

    const input = UpdateEmailDto.parse(body);

    const foundOtp = await userService.findOtp(input.code, req.user.id);

    await userService.updateEmail(req.user.id, foundOtp.email);

    await userService.deleteOtp(foundOtp.id);

    return res.status(201).json({
      data: {},
      message: "Email successfully updated",
    });
  } catch (err) {
    handleErrors(res, err);
  }
}

module.exports = { sendOtp, verifyEmail, updateEmail };
