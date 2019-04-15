import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { ApplicationModule } from './app.module';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import requestLogger from './common/middlewares/requestlogger.middleware';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  // API documentation
  setupSwagger(app);

  // Log requests
  app.use(requestLogger);

  // Intercept EntityNotFound error and return 404
  app.useGlobalInterceptors(new ErrorsInterceptor());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.API_PORT, '0.0.0.0');
}

bootstrap();
