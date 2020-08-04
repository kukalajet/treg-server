import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig = config.get('db');

console.log(`type: ${dbConfig.type}`);
console.log(`host: ${dbConfig.host}`);
console.log(`port: ${dbConfig.port}`);
console.log(`username: ${dbConfig.username}`);
console.log(`password: ${dbConfig.password}`);
console.log(`database: ${dbConfig.database}`);
console.log(`synchronize: ${process.env.TYPEORM_SYNC || dbConfig.synchronize}`);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  // host: process.env.RDS_HOSTNAME || dbConfig.host,
  host: dbConfig.host,
  // port: process.env.RDS_PORT || dbConfig.port,
  port: dbConfig.port,
  // username: process.env.RDS_USERNAME || dbConfig.username,
  username: dbConfig.username,
  // password: process.env.RDS_PASSWORD || dbConfig.password,
  password: dbConfig.password,
  // database: process.env.RDS_DB_NAME || dbConfig.database,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  // synchronize: dbConfig.synchronize,
  ssl: true
}