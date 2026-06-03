const z = require("zod");

const DeleteTodoDto = z.object({
    id: z.uuid(),
});

module.exports = DeleteTodoDto;
