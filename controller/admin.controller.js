const SuperAdminLoginDto = require("../dtos/super-admin-login.dto");
const InviteAdminDto = require("../dtos/invite-admin.dto");
const ChangePasswordDto = require("../dtos/change-password.dto");
const adminService = require("../model/admin.service");
const authService = require("../model/auth.service");
const userService = require("../model/user.service");
const { handleErrors } = require("./handle-errors");
const { sendMail } = require("../model/mail.service");



async function superAdminLogin(req, res) {
    try {
        const body = req.body;

        const input = SuperAdminLoginDto.parse(body);

        const token = await adminService.superAdminLogin(input);

        return res.json({ data: token, message: "You logged in successfully!" });
    } catch (err) {
        handleErrors(res, err);
    }
}


async function inviteAdmin(req, res) {
    try {
        const body = req.body;

        const input = InviteAdminDto.parse(body);

        const admin = await adminService.inviteAdmin(input);

        return res.status(201).json({
            data: admin,
            message:
                "You are invited successfully!!!"
        });

    } catch (err) {
        handleErrors(res, err);
    }
}


async function changePassword(req, res) {
    try {
        const input = ChangePasswordDto.parse(req.body);

        const result = await adminService.changePassword(input);

        return res.status(200).json({
            data: result,
            message: "Password changed successfully",
        });

    } catch (err) {
        handleErrors(res, err);
    }
}

async function deleteUser(req, res) {
    try {
        const admin = req.admin;

        const userId = req.params.userId;

        const deletedUser = await userService.deleteUser({ userId }, admin);

        return res.status(200).json({
            data: deletedUser,
            message: "User deleted successfully!",
        });

    } catch (err) {
        handleErrors(res, err);
    }

}


module.exports = { superAdminLogin, inviteAdmin, changePassword, deleteUser };
