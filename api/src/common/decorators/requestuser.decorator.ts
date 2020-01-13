import { createParamDecorator } from '@nestjs/common';

export const RequestUser = createParamDecorator((data: string, req) =>
  data ? req.user && req.user[data] : req.user
);
