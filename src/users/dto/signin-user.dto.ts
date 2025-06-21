import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SigninUserDto {
  @IsEmail({}, { message: 'Por favor, informe um email válido.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(20, { message: 'A senha deve ter no máximo 20 caracteres.' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
  })
  password: string;
}
