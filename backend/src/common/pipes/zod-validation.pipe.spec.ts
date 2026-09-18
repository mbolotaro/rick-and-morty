import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { createZodDto } from '../validation/zod-dto.js';
import { ZodValidationPipe } from './zod-validation.pipe.js';

const InputDto = createZodDto(z.object({ page: z.coerce.number().int().positive(), status: z.enum(['alive', 'dead']) }));

describe('ZodValidationPipe', () => {
  it('returns parsed and coerced values', () => {
    const pipe = new ZodValidationPipe(InputDto);
    expect(pipe.transform({ page: '2', status: 'alive' }, { type: 'query' })).toEqual({ page: 2, status: 'alive' });
  });

  it('rejects invalid enum and number values as a bad request', () => {
    const pipe = new ZodValidationPipe(InputDto);
    expect(() => pipe.transform({ page: '0', status: 'anything' }, { type: 'query' })).toThrow(BadRequestException);
  });
});
