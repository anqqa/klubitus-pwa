import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const { raw: req } = context.getRequest();
    const status = exception.getStatus();

    // @ts-ignore
    BaseExceptionFilter.logger.debug(
      `[${status} ${HttpStatus[status]}] [${req.method}] ${req.url}`,
      'Request'
    );

    return super.catch(exception, host);
  }
}
