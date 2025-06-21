import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*', // Permite todas as origens por padrão
    methods: configService.get('CORS_METHODS') || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não esperadas
    forbidNonWhitelisted: true, // Lança erro se propriedades não esperadas forem encontradas
    transform: true, // Transforma os dados recebidos em instâncias das classes DTO
    transformOptions: {
      enableImplicitConversion: true, // Permite conversão implícita de tipos primitivos
    },
  }))
  const port = configService.get('PORT');

  await app.listen(port, () => {
    console.log(`Application running at ${port}`);
  });
}
bootstrap();
