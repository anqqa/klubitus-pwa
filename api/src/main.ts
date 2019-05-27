import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { ApplicationModule } from './app.module';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { RequestLoggerInterceptor } from './common/interceptors/requestlogger.interceptor';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  // API documentation
  setupSwagger(app);

  // Security
  app.enableCors();

  app.useGlobalInterceptors(new ErrorsInterceptor(), new RequestLoggerInterceptor());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.API_PORT, '0.0.0.0');
}

bootstrap();
