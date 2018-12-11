import { Injectable } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Injectable()
export class AppService {

  private globalConfig: ConfigService;

  private db: DynamicModule;

  constructor(config: ConfigService) {
    this.globalConfig = config;
    this.db = TypeOrmModule.forRootAsync({
      useClass: ConfigService,
    });
  }

  root(): string {
    return 'Hello Nest!';
  }

}
