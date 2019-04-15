import { Logger } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

export default function requestLogger(req: IncomingMessage, res: ServerResponse, next: () => void) {
  Logger.debug(`${req.method} ${req.url}`, 'Request', false);

  next();
}
