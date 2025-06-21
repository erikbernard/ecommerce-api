// src/common/dto/product-query.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsNumber, Min, IsString, isEnum, isBoolean } from 'class-validator';
import { EOrder } from 'src/common/enums/EOrder';
import { EProductProvider } from 'src/common/enums/EProductProvider';

export class QueryProductDto {
  // paginação
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  readonly offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  readonly limit?: number = 10;

  // filtros
  @IsOptional()
  @IsEnum(EProductProvider)
  readonly provider?: EProductProvider;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly maxPrice?: number;

  @IsOptional()
  @IsString()
  readonly name?: string;

  // ordenação (ASC ou DESC)
  @IsOptional()
  @IsEnum(EOrder)
  readonly order?: EOrder = EOrder.DESC;

  @IsOptional()
  @Type(() => Boolean)
  readonly hasDiscount?: boolean = false;
}

