import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as envVar from './../../config/env.util';
import TranslatorService from './../../translations/translator.service';
import { UsersService } from '../users/users.service';
import { CryptoService } from './../../config/crypto.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RequestLanguageMiddleware } from './../../interceptors/request-language.middleware';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: envVar.default.JWT_SECRET_KEY || 'secret-key',
      signOptions: {
        expiresIn: envVar.default.JWT_TTL || 86400,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TranslatorService,
    UsersService,
    CryptoService,
  ],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLanguageMiddleware)
      .forRoutes(AuthController);
  }
}