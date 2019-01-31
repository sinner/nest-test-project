import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';

const environment = (process.env.NODE_ENV !== undefined && typeof process.env.NODE_ENV === 'string') ?
  process.env.NODE_ENV : '';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
