import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig = config.get('db');

console.log(`synchronize: ${process.env.TYPEORM_SYNC || dbConfig.synchronize}`);
console.log(JSON.stringify(dbConfig));

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
}