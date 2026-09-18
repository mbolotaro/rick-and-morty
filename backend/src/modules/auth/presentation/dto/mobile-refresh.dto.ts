import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const mobileRefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export class MobileRefreshDto extends createZodDto(mobileRefreshSchema) {}
