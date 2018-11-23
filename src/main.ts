import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  await app.listen(3000);
  // await app.listen(3000, '0.0.0.0'); // Docker container

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
