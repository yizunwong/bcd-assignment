import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export class CommonResponseDto<T = any> {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  count?: number;

  constructor(partial: Partial<CommonResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

export const ApiCommonResponse = <TModel extends Type<unknown>>(
  model: TModel,
  isArray = false,
  description = 'Success response',
) => {
  return applyDecorators(
    ApiExtraModels(CommonResponseDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(CommonResponseDto) },
          {
            properties: {
              data: isArray
                ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
