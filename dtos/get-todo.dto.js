const { z } = require("zod");

const GetTodoDto = z.object({
  id: z.uuid(),
});

module.exports = GetTodoDto;