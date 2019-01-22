import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { RequestLanguageMiddleware } from './interceptors/request-language.middleware';

declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Tera Ping-Pong API')
    .setDescription('This is the API of the Tera Ping-Pong Application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  // await app.listen(3000, '0.0.0.0'); // Docker container

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

}

bootstrap();
