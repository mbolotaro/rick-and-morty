import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';

const rateCommentSchema = z.object({
  value: z.enum(['UP', 'DOWN']),
});

export class RateCommentDto extends createZodDto(rateCommentSchema) {}
