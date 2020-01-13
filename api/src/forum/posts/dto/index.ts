import { DtoOptions } from '@nestjsx/crud';

import { CreatePostDto } from './create-post.dto';

export const dto: DtoOptions = {
  create: CreatePostDto,
};
