import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const page = z.coerce.number().int().min(1).max(1000).optional();

const locationsQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  type: z.string().trim().optional(),
  dimension: z.string().trim().optional(),
});

export class LocationsQueryDto extends createZodDto(locationsQuerySchema) {}
