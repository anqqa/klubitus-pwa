import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Connection } from 'typeorm';

@ValidatorConstraint({ async: true, name: 'isUnique' })
@Injectable()
export class IsUnique implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  defaultMessage(validationArguments?: ValidationArguments): string {
    return '$property already exists';
  }

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const [entity] = args.constraints;
    const column = args.property;

    const qb = this.connection.getRepository(entity).createQueryBuilder();
    const count = await qb.where(`LOWER(${column}) = LOWER(:value)`, { value }).getCount();

    return count === 0;
  }
}
