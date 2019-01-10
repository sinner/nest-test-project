import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';

import { RequestLanguageMiddleware } from './interceptors/request-language.middleware';
import TranslatorService from './translations/translator.service';
import { StandardResponseInterceptor } from './interceptors/standard-response.interceptor';
import { ErrorsResponseInterceptor } from './interceptors/errors-response.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TranslatorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLanguageMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
