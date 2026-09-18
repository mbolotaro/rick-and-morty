import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const page = z.coerce.number().int().min(1).max(1000).optional();

const episodesQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  episode: z.string().trim().optional(),
});

export class EpisodesQueryDto extends createZodDto(episodesQuerySchema) {}
