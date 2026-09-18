import { z } from 'zod';
import { createZodDto } from '../../../../common/validation/zod-dto.js';

const page = z.coerce.number().int().positive().optional();

const episodesQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  episode: z.string().trim().optional(),
});

export class EpisodesQueryDto extends createZodDto(episodesQuerySchema) {}
