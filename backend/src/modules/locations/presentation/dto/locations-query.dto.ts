import { z } from 'zod';
import { createZodDto } from '../../../../common/validation/zod-dto.js';

const page = z.coerce.number().int().positive().optional();

const locationsQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  type: z.string().trim().optional(),
  dimension: z.string().trim().optional(),
});

export class LocationsQueryDto extends createZodDto(locationsQuerySchema) {}
