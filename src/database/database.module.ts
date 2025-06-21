import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/common/interfaces/database-config.interface';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        if (!dbConfig) {
          throw new Error('Database configuration is missing');
        }
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        return {
          type: 'postgres' as const,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*.ts'],
          synchronize: isDevelopment, // Só em desenvolvimento
          migrationsRun: !isDevelopment, // Roda migrations automaticamente em produção
          logging: isDevelopment,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}