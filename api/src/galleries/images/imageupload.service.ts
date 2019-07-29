import { ConflictException, Injectable, Logger, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs-extra';
import { extension } from 'mime-types';
import { normalize } from 'path';
import * as pump from 'pump';
import { DeepPartial, getConnection, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { S3Client } from '../../common/aws/s3.client';
import { ColorUtil } from '../../common/helpers/color.util';
import { MetadataUtil } from '../../common/helpers/metadata.util';
import { PhashUtil } from '../../common/helpers/phash.util';
import { GalleriesService } from '../galleries.service';
import { Gallery } from '../gallery.entity';
import { GalleryImage } from './image.entity';

const LOG_CONTEXT = 'Upload';

@Injectable()
export class ImageUploadService {
  constructor(
    @InjectRepository(GalleryImage) private readonly imageRepository: Repository<GalleryImage>,
    private readonly galleriesService: GalleriesService,
    private readonly s3Client: S3Client
  ) {}

  async handleUpload(@Req() req: any, @Res() res: any) {
    const galleries = this.galleriesService;
    const imageRepository = this.imageRepository;
    const s3Client = this.s3Client;
    const targetField = 'photos';
    const uploadPath = normalize('./upload/');

    fs.ensureDirSync(uploadPath);

    const target: any = {
      event_id: null,
      gallery_id: null,
    };

    const image: DeepPartial<GalleryImage> = {
      author_id: req.user.id,
      uuid: uuid(),
    };

    function handler(
      field: string,
      file: pump.Stream,
      filename: string,
      encoding: string,
      mimetype: string
    ) {
      Logger.debug(`Handling ${filename} (${mimetype})`, LOG_CONTEXT);

      image.file = `${image.uuid}.${extension(mimetype)}`;
      image.mime_type = mimetype;
      image.original_filename = filename;

      Logger.debug(`Saving as ${image.file}`, LOG_CONTEXT);

      const filePath = `${uploadPath}${image.file}`;
      const writeStream = fs.createWriteStream(filePath);

      pump(file, writeStream);
    }

    async function onFinished(error: any) {
      if (error) {
        Logger.warn('Image upload failed', LOG_CONTEXT);

        throw new ConflictException(error);
      }

      Logger.debug(`Upload of ${image.file} finished`, LOG_CONTEXT);

      const sourcePath = `${uploadPath}${image.file}`;

      image.path = s3Client.getKeyForImage(image.file);

      let isUploadedToS3 = false;
      let imageModel;

      try {
        // Get metadatas
        const [stats, [meta, exif], color, hash] = await Promise.all([
          fs.stat(sourcePath),
          MetadataUtil.getMetadataAndExif(sourcePath),
          ColorUtil.dominantColor(sourcePath),
          PhashUtil.phash(sourcePath),
        ]);

        image.original_size = stats.size;
        image.original_width = meta.width;
        image.original_height = meta.height;
        image.exif = exif;
        image.color = ColorUtil.rgb2hex(color);
        image.phash = hash.toString();

        // Upload to S3 and detect labels
        await s3Client.upload(sourcePath, image.path);
        isUploadedToS3 = true;

        const { Labels } = await s3Client.detectLabels(image.path);
        image.labels = Labels;

        // Insert to DB
        const gallery = await galleries.getOrCreateByEvent(target.gallery_id, target.event_id);
        imageModel = await imageRepository.save(image);

        await getConnection()
          .createQueryBuilder()
          .relation(Gallery, 'images')
          .of(gallery)
          .add(imageModel);

        res.send(imageModel.id);
      } catch (error) {
        Logger.warn('Failed', LOG_CONTEXT);

        // Cleanup
        if (isUploadedToS3 && image.path) {
          await s3Client.delete(image.path);
        }

        if (imageModel) {
          await imageRepository.remove(imageModel);
        }

        throw new ConflictException(typeof error === 'string' ? error : 'Could not save image');
      } finally {
        Logger.debug(`Deleting ${sourcePath}`, LOG_CONTEXT);

        fs.removeSync(sourcePath);
      }
    }

    function onFormData(key: string, value: string) {
      if (key === targetField) {
        const metadata = JSON.parse(value);

        target.event_id = (metadata && metadata.event_id) || null;
        target.gallery_id = (metadata && metadata.gallery_id) || null;
      }
    }

    const multipart = req.multipart(handler, onFinished);

    multipart.on('field', onFormData);
  }

}
