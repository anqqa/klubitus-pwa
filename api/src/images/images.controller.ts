import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from '@nestjsx/crud';

import { Image } from './image.entity';
import { ImagesService } from './images.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController implements CrudController<Image> {
  constructor(readonly service: ImagesService) {}

  get base(): CrudController<Image> {
    return this;
  }
}
