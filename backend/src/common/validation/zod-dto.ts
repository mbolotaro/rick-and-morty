import { z } from 'zod';

export type ZodDtoClass<
  TSchema extends z.ZodType<object> = z.ZodType<object>,
> = (new () => object) & {
  readonly schema: TSchema;
};

export function createZodDto<TSchema extends z.ZodType<object>>(
  schema: TSchema,
): ZodDtoClass<TSchema> {
  class ZodDto {
    static readonly schema = schema;
  }

  return ZodDto as ZodDtoClass<TSchema>;
}
