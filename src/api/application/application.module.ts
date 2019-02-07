import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './../auth/auth.service';
import { JwtStrategy } from './../auth/jwt.strategy';
import { UserRepository } from './../../entities/repositories/user.repository';
import User from './../../entities/user.entity';
import * as envVar from './../../config/env.util';

import { RequestLanguageMiddleware } from './../../interceptors/request-language.middleware';
import { RequestRequiredHeadersMiddleware } from './../../interceptors/request-required-headers.middleware';
import TranslatorService from './../../translations/translator.service';
import { ConfigService } from './../../config/config.service';
import { CryptoService } from './../../helpers/crypto.service';
import { AuthModule } from './../../api/auth/auth.module';
import Application from './../../entities/application.entity';
import { ApplicationRepository } from '../../entities/repositories/application.repository';
import { UsersModule } from '../users/users.module';
import { AppModule } from '../../app.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Application, ApplicationRepository]),
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    CryptoService,
    TranslatorService,
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLanguageMiddleware, RequestRequiredHeadersMiddleware)
      .forRoutes(ApplicationController);
  }
}
