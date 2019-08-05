import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { getConnection, Repository } from 'typeorm';

import { S3Client } from '../../common/aws/s3.client';
import { BaseCrudService } from '../../common/basecrud.service';
import { ColorUtil } from '../../common/helpers/color.util';
import { MetadataUtil } from '../../common/helpers/metadata.util';
import { PhashUtil } from '../../common/helpers/phash.util';
import { File } from '../../common/interceptors/file.interceptor';
import { Gallery } from '../gallery.entity';
import { GalleryImage } from './image.entity';

@Injectable()
export class GalleryImagesService extends BaseCrudService<GalleryImage> {
  constructor(
    @InjectRepository(GalleryImage) repo: Repository<GalleryImage>,
    readonly s3Client: S3Client
  ) {
    super(repo);
  }

  async createToGallery(userId: number, file: File, gallery: Gallery): Promise<GalleryImage> {
    let image = new GalleryImage();
    image.author_id = userId;
    image.file = file.filename;
    image.gallery = gallery;
    image.mime_type = file.mimetype;
    image.original_filename = file.originalname;
    image.original_size = file.filesize;
    image.uuid = file.uuid;

    try {
      // Metadata
      const [[meta, exif], color, hash] = await Promise.all([
        MetadataUtil.getMetadataAndExif(file.tempfile),
        ColorUtil.dominantColor(file.tempfile),
        PhashUtil.phash(file.tempfile),
      ]);
      image.original_width = meta.width;
      image.original_height = meta.height;
      image.exif = exif && !isEmpty(exif) ? exif : null;
      image.color = ColorUtil.rgb2hex(color);
      image.phash = hash.toString();

      // AWS
      const s3path = this.s3Client.getKeyForImage(file.filename);
      await this.s3Client.upload(file.tempfile, s3path);
      image.path = s3path;
      const { Labels } = await this.s3Client.detectLabels(image.path);
      image.labels = Labels;

      image = await this.repo.save(image);

      await getConnection()
        .createQueryBuilder()
        .relation(Gallery, 'images')
        .of(gallery)
        .add(image);

      return image;
    } catch (error) {
      if (image.path) {
        await this.s3Client.delete(image.path);
      }

      if (image.id) {
        await this.repo.delete(image);
      }

      throw error;
    }
  }
}
