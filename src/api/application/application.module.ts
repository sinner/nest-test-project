import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './../../entities/repositories/user.repository';
import User from './../../entities/user.entity';

import { RequestLanguageMiddleware } from './../../interceptors/request-language.middleware';
import { RequestRequiredHeadersMiddleware } from './../../interceptors/request-required-headers.middleware';
import TranslatorService from './../../translations/translator.service';
import { ConfigService } from './../../config/config.service';
import { CryptoService } from './../../helpers/crypto.service';
import { AuthModule } from './../../api/auth/auth.module';
import Application from './../../entities/application.entity';
import { ApplicationRepository } from '../../entities/repositories/application.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, ApplicationRepository]),
  ],
  controllers: [ApplicationController],
  providers: [
    TranslatorService,
    ApplicationService,
    CryptoService,
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLanguageMiddleware, RequestRequiredHeadersMiddleware)
      .forRoutes(ApplicationController);
  }
}
