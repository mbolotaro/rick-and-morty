import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';

const rateCommentParamsSchema = z.object({
  commentId: z.string().min(1),
});

export interface RateCommentParams {
  commentId: string;
}
export class RateCommentParamsDto extends createZodDto(rateCommentParamsSchema) {}
