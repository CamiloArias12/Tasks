import { DataSource } from 'typeorm';
import { User } from './src/database/entities/user.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

// Create and export only one DataSource instance as default
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.USER_DB_HOST || 'localhost',
  port: parseInt(process.env.USER_DB_PORT) || 5432,
  username: process.env.USER_DB_USERNAME || 'postgres',
  password: process.env.USER_DB_PASSWORD || 'password',
  database: process.env.USER_DB_NAME || 'postgres',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default AppDataSource; // Only one default export