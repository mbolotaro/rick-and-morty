import { ApiBody, type SchemaObject } from '@nestjs/swagger';
import { z } from 'zod';
import type { ZodDtoClass } from '../validation/zod-dto.js';

export function ApiZodBody<TSchema extends z.ZodType<object>>(
  dto: ZodDtoClass<TSchema>,
) {
  return ApiBody({
    schema: z.toJSONSchema(dto.schema) as SchemaObject,
  });
}
