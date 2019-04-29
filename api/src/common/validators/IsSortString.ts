import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsSortString(sortValues: string[], options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [],
      options,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'string') {
            const sortValue = ['+', '-'].includes(value[0]) ? value.substring(1) : value;

            return sortValues.includes(sortValue);
          }

          return false;
        },
      },
    });
  };
}
