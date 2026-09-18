import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import type { z } from 'zod';
import { translate } from '../i18n/translate.js';

@Injectable()
export class ZodValidationPipe<
  TSchema extends z.ZodType,
> implements PipeTransform<z.input<TSchema>, z.output<TSchema>> {
  constructor(private readonly schema: TSchema) {}

  transform(value: z.input<TSchema>): z.output<TSchema> {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    throw new BadRequestException({
      message: translate(
        'errors.validation.invalidInput',
        'Dados de entrada inválidos.',
      ),
      issues: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message.startsWith('errors.')
          ? translate(issue.message, 'Valor inválido.')
          : translate(
              `errors.validation.${issue.code}`,
              translate('errors.validation.invalidField', 'Valor inválido.'),
            ),
      })),
    });
  }
}
