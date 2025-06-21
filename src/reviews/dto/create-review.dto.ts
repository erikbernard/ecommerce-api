import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Rating é obrigatório' })
  @IsNumber({}, { message: 'Rating deve ser um número' })
  @Min(1, { message: 'Rating deve ser no mínimo 1' })
  @Max(5, { message: 'Rating deve ser no máximo 5' })
  rating: number;

  @IsOptional()
  @IsString({ message: 'Comentário deve ser uma string' })
  comment?: string;

  @IsNotEmpty({ message: 'User ID é obrigatório' })
  @IsString({ message: 'User ID deve ser uma string' })
  user_id: string;

  @IsNotEmpty({ message: 'Product ID é obrigatório' })
  @IsNumber({}, { message: 'Product ID deve ser um número' })
  product_id: number;
}