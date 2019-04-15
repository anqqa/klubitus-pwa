import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { ApplicationModule } from './app.module';
import logger from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  app.use(logger);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.API_PORT, '0.0.0.0');
}

bootstrap();
