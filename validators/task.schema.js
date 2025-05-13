const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

module.exports = { createTaskSchema };
