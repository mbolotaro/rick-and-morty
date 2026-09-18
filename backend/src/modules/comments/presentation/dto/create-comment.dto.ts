import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});

export class CreateCommentDto extends createZodDto(createCommentSchema) {}
