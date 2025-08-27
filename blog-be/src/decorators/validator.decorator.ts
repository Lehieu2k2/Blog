import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsUndefinable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((obj, value) => value !== undefined, options);
}
