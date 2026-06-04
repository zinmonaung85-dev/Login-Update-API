const z = require("zod");

const AdminLoginDto = z.object({
    email: z.email(),
    password: z.string().min(6),
});

module.exports = AdminLoginDto;
