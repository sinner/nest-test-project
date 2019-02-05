import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './../../entities/repositories/user.repository';
import User from './../../entities/user.entity';

import { RequestLanguageMiddleware } from './../../interceptors/request-language.middleware';
import { RequestRequiredHeadersMiddleware } from './../../interceptors/request-required-headers.middleware';
import TranslatorService from './../../translations/translator.service';
import { ConfigService } from './../../config/config.service';
import { CryptoService } from './../../helpers/crypto.service';
import { AuthModule } from './../../api/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
  ],
  controllers: [UsersController],
  providers: [
    TranslatorService,
    UsersService,
    CryptoService,
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLanguageMiddleware, RequestRequiredHeadersMiddleware)
      .forRoutes(UsersController);
  }
}
