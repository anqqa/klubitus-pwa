import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationException extends BadRequestException {
  errors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    const errors: Record<string, string[]> = {};

    validationErrors.forEach(error => {
      errors[error.property] = Object.values(error.constraints);
    });

    super({ message: 'Validation failed', errors });

    this.errors = validationErrors;
  }
}
