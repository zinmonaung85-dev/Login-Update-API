const z = require("zod");

const UpdateTodoDto = z.object({
    // id: z.uuid(),
    title: z.string().min(3),
    description: z.string().optional(),
});

module.exports = UpdateTodoDto;
