import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { RequestLanguageMiddleware } from './interceptors/request-language.middleware';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { ApplicationModule } from './api/application/application.module';

declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Nest Project API')
    .setDescription('This is the API Application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  //const authOptions = new DocumentBuilder()
  //  .addTag('Auth')
  //  .build();
  //const authDocument = SwaggerModule.createDocument(app, authOptions, { include: [AuthModule] });
  //SwaggerModule.setup('api/auth', app, authDocument);
  //
  //const userOptions = new DocumentBuilder()
  //  .addTag('User')
  //  .build();
  //const userDocument = SwaggerModule.createDocument(app, userOptions, { include: [UsersModule] });
  //SwaggerModule.setup('api/users', app, userDocument);
  //
  //const applicationOptions = new DocumentBuilder()
  //  .addTag('User')
  //  .build();
  //const applicationDocument = SwaggerModule.createDocument(app, applicationOptions, { include: [ApplicationModule] });
  //SwaggerModule.setup('api/users', app, applicationDocument);

  // await app.listen(3000);
  await app.listen(3000, '0.0.0.0'); // Docker container

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}

bootstrap();
