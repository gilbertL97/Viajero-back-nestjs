import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

// Validador personalizado
export function IsRequiredIfExist(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsRequiredIfExistValidator,
    });
  };
}

@ValidatorConstraint({ name: 'IsRequiredIfExist', async: false })
export class IsRequiredIfExistValidator
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value ? relatedValue !== undefined : true;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} es requerido si  $property está presente.`;
  }
}
