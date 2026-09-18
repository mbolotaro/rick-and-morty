import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';

const mobileRefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export class MobileRefreshDto extends createZodDto(mobileRefreshSchema) {}
