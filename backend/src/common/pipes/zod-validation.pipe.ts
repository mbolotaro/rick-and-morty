import { BadRequestException, type ArgumentMetadata, type PipeTransform } from '@nestjs/common';
import { z } from 'zod';
import { translate } from '../i18n/translate.js';
import type { ZodDtoClass } from '../validation/zod-dto.js';

export class ZodValidationPipe<TSchema extends z.ZodType<object>>
  implements PipeTransform<object, z.output<TSchema>>
{
  constructor(private readonly dto: ZodDtoClass<TSchema>) {}

  transform(value: object, _metadata: ArgumentMetadata): z.output<TSchema> {
    const result = this.dto.schema.safeParse(value);
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
