import { Logger } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';

export default function logger(req: IncomingMessage, res: ServerResponse, next: () => void) {
  Logger.debug({ method: req.method, url: req.url }, 'Request', false);

  next();
}
