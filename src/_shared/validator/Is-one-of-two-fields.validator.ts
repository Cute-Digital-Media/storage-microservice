import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsOneOfTwoFields(
  field1: string,
  field2: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOneOfTwoFields',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          return !!(object[field1] || object[field2]);
        },
        defaultMessage(args: ValidationArguments) {
          return `Either ${field1} or ${field2} must be provided`;
        },
      },
    });
  };
}
