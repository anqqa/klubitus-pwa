import {
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudActions,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { RequestUser } from '../auth/requestuser.decorator';

import { EntityForbiddenError } from '../common/errors/entityforbidden.error';
import { File, FileInterceptor, FileUploadDto } from '../common/interceptors/file.interceptor';
import { GalleriesService } from '../galleries/galleries.service';
import { GalleryImage } from '../galleries/images/image.entity';
import { GalleryImagesService } from '../galleries/images/images.service';
import { Event } from './event.entity';
import { EventsService } from './events.service';

@Crud({
  model: { type: Event },
  query: { maxLimit: 500 },
})
@ApiTags('Events')
@Controller('events')
export class EventsController implements CrudController<Event> {
  constructor(
    readonly service: EventsService,
    readonly galleriesService: GalleriesService,
    readonly galleryImagesService: GalleryImagesService
  ) {}

  get base(): CrudController<Event> {
    return this;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest, @Req() { user }: any): Promise<void | Event> {
    const model = await this.service.getOne(req);

    if (!model.can(CrudActions.DeleteOne, user && user.roles)) {
      throw new EntityForbiddenError(model);
    }

    return this.base.deleteOneBase(req);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(new FileInterceptor('file'))
  @Post(':eventId/images')
  async upload(
    @Param() params: any,
    @RequestUser() user: any,
    @UploadedFile('file') file: File
  ): Promise<GalleryImage> {
    const eventId = parseInt(params.eventId, 10);
    const gallery = await this.galleriesService.getOrCreateByEvent(eventId);

    if (!gallery) {
      throw new NotFoundException(`Gallery for event ${eventId} not found`);
    }

    return this.galleryImagesService.createToGallery(user.id, file, gallery);
  }
}
