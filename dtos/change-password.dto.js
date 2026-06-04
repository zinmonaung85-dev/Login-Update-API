const { z } = require("zod");

const ChangePasswordDto = z.object({
    email: z.string().email(),
    oldPassword: z.string(),
    newPassword: z.string().min(6),
});

module.exports = ChangePasswordDto;