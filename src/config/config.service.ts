import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { TypeOrmModule, TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import env from './env.util';

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory {

  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: env.TYPEORM_HOST,
      port: parseInt(env.TYPEORM_PORT, 10),
      username: env.TYPEORM_USERNAME,
      password: env.TYPEORM_PASSWORD,
      database: env.TYPEORM_DATABASE,
      synchronize: (!!env.TYPEORM_SYNCHRONIZE || true),
      logging: ["query", "error", "schema", "warn", "log", "info"],
      entities: [__dirname + '/../entities/*.entity.ts'],
      subscribers: [__dirname + '/../entities/subscribers/*.subscriber.ts'],
      migrations: [__dirname + '/../migrations/*{.ts}'],
      cli: {
          entitiesDir: 'src/entities',
          subscribersDir: 'src/entities/subscribers',
      },
    };
  }

}
