import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { translate } from '../i18n/translate.js';

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error) =>
    new BadRequestException({
      message: translate(
        'errors.validation.invalidInput',
        'Dados de entrada inválidos.',
      ),
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message.startsWith('errors.')
          ? translate(issue.message, 'Valor inválido.')
          : translate(
              `errors.validation.${issue.code}`,
              translate('errors.validation.invalidField', 'Valor inválido.'),
            ),
      })),
    }),
});
