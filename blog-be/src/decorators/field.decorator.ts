import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { ToArray } from './transform.decorator';

interface INumberFieldOptions {
  each?: boolean;
  minimum?: number;
  maximum?: number;
  int?: boolean;
  isPositive?: boolean;
  swagger?: boolean;
}

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => Number)];

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { each, int, minimum, maximum, isPositive, swagger } = options;

  if (swagger !== false) {
    decorators.push(
      ApiProperty({ type: Number, ...options, example: int ? 1 : 1.2 }),
    );
  }

  if (each) {
    decorators.push(ToArray());
  }

  if (int) {
    decorators.push(IsInt({ each }));
  } else {
    decorators.push(IsNumber({}, { each }));
  }

  if (typeof minimum === 'number') {
    decorators.push(Min(minimum, { each }));
  }

  if (typeof maximum === 'number') {
    decorators.push(Max(maximum, { each }));
  }

  if (isPositive) {
    decorators.push(IsPositive({ each }));
  }

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{
      each: boolean;
      int: boolean;
      isPositive: boolean;
    }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    NumberField({ required: false, ...options }),
  );
}
