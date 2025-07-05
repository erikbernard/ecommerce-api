import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from '../interfaces/database-config.interface';

export default registerAs('database', (): DatabaseConfig => ({
  databaseUrl: process.env.DATABASE_URL,
}));