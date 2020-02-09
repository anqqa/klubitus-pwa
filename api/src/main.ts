import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { CrudConfigService } from '@nestjsx/crud';
import { useContainer } from 'class-validator';
import { parse as querystringParser } from 'qs';

CrudConfigService.load({
  query: { maxLimit: 500 },
  queryParser: {
    paramNamesMap: { join: 'include', limit: 'limit' },
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase'],
  },
});

import { ApplicationModule } from './app.module';
import { ValidationException } from './common/errors/validation.exception';
import { HttpExceptionFilter } from './common/filters/httpexception.filter';
import { PrivateGuard } from './common/guards/private.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptor';
import { RequestLoggerInterceptor } from './common/interceptors/requestlogger.interceptor';
import { TrimPipe } from './common/pipes/TrimPipe';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const fastify = new FastifyAdapter({ querystringParser });
  fastify.register(require('fastify-multipart'));

  const app = await NestFactory.create<NestFastifyApplication>(ApplicationModule, fastify);
  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  // API documentation
  setupSwagger(app);

  // Security
  app.enableCors();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new RequestLoggerInterceptor(), new ErrorsInterceptor());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new PrivateGuard(reflector), new RolesGuard(reflector));

  app.useGlobalPipes(
    new TrimPipe(),
    new ValidationPipe({
      exceptionFactory: errors => new ValidationException(errors as any),
      transform: true,
      validationError: { target: false, value: false },
      whitelist: true,
    })
  );

  await app.listen(Number(process.env.API_PORT), '0.0.0.0');
}

bootstrap();
