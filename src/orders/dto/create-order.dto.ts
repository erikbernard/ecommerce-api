import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNotEmpty({ message: 'Product ID é obrigatório' })
  @IsNumber({}, { message: 'Product ID deve ser um número' })
  product_id: number;

  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(1, { message: 'Quantidade deve ser no mínimo 1' })
  quantity: number;

  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Preço deve ser um número válido com no máximo 2 casas decimais' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CARD = 'card',
  PIX = 'pix',
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'User ID é obrigatório' })
  @IsString({ message: 'User ID deve ser uma string' })
  userId: string;

  @IsNotEmpty({ message: 'Total é obrigatório' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total deve ser um número válido com no máximo 2 casas decimais' })
  @Min(0.01, { message: 'Total deve ser maior que zero' })
  total: number;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Status deve ser um valor válido' })
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'Método de pagamento deve ser um valor válido' })
  payment_method?: PaymentMethod;

  @IsNotEmpty({ message: 'Items são obrigatórios' })
  @IsArray({ message: 'Items deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsNotEmpty({ message: 'Endereço de entrega é obrigatório' })
  address: string; // Endereço de entrega
}