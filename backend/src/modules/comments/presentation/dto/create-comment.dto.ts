import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';
import { COMMENT_MAX_LENGTH } from '../../domain/comment.constants.js';

const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(COMMENT_MAX_LENGTH),
});

export class CreateCommentDto extends createZodDto(createCommentSchema) {}
