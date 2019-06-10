import { ConflictException, Injectable, Logger, Req, Res } from '@nestjs/common';
import * as fs from 'fs-extra';
import { extension } from 'mime-types';
import { normalize } from 'path';
import * as pump from 'pump';
import { v4 as uuid } from 'uuid';

const LOG_CONTEXT = 'Upload';

@Injectable()
export class ImageUploadService {
  constructor() {}

  async handleUpload(@Req() req: any, @Res() res: any) {
    const targetField = 'photos';
    const uploadPath = normalize('./upload/');

    fs.ensureDirSync(uploadPath);

    const image: any = {
      author_id: req.user.id,
      color: null,
      event_id: null,
      exif: null,
      file: null,
      gallery_id: null,
      labels: null,
      mime_type: null,
      original_filename: null,
      original_height: null,
      original_size: null,
      original_width: null,
      path: null,
      phash: null,
      uuid: uuid(),
    };

    function handler(
      field: string,
      file: pump.Stream,
      filename: string,
      encoding: string,
      mimetype: string,
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

        console.log({ error });

        throw new ConflictException(error);
      }

      Logger.debug(`Upload of ${image.file} finished`, LOG_CONTEXT);

      const sourcePath = `${uploadPath}${image.file}`;
      // const targetKey  = image.path = getKeyForImage(image.file);

      const isUploadedToS3 = false;

      try {
        // Get metadatas
        const [stats /*, [meta, exif], color, hash*/] = await Promise.all([
          fs.stat(sourcePath),
          // metadata(sourcePath),
          // dominantColor(sourcePath),
          // phash(sourcePath),
        ]);

        image.original_size = stats.size;
        /*
        image.original_width  = meta.width;
        image.original_height = meta.height;
        image.exif            = exif;
        image.color           = rgb2hex(color);
        image.phash           = hash.toString();

        // Upload to S3 and detect labels
        await uploadToS3(sourcePath, targetKey);
        isUploadedToS3 = true;

        const { Labels } = await detectLabels(targetKey);

        request.log.debug({ Labels });

        image.labels = Labels;

        // Insert to DB
        const { event_id, gallery_id, ...model } = image;

        let galleryModel;

        // Try to get existing gallery
        if (gallery_id) {
          galleryModel = await Gallery.query().findById(gallery_id);
        }

        if (!galleryModel && event_id) {
          galleryModel = await Gallery.query().where('event_id', event_id).first();

          // Create new gallery?
          if (!galleryModel) {
            const eventModel = await Event.query().findById(event_id);

            if (!eventModel) {
              throw 'Gallery or event id is required';
            }

            galleryModel = await Gallery.query()
              .insert({
                event_date: eventModel.begins_at,
                event_id:   eventModel.id,
                name:       eventModel.name,
              });
          }
        }

        // Insert image
        const imageModel = await galleryModel.$relatedQuery('images')
          .insert(model);

        reply.send(imageModel.id);
        */
        res.send('ok');
      } catch (error) {
        Logger.warn('Failed', LOG_CONTEXT, false);

        console.log({ error });

        // Cleanup S3
        // if (isUploadedToS3) {
        //   await deleteFile(targetKey);
        // }

        throw new ConflictException(typeof error === 'string' ? error : 'Could not save image');
      } finally {
        Logger.debug(`Removing ${sourcePath}`, LOG_CONTEXT);

        fs.removeSync(sourcePath);
      }
    }

    function onFormData(key: string, value: string) {
      if (key === targetField) {
        const metadata = JSON.parse(value);

        image.event_id = (metadata && metadata.event_id) || null;
        image.gallery_id = (metadata && metadata.gallery_id) || null;
      }
    }

    const multipart = req.multipart(handler, onFinished);

    multipart.on('field', onFormData);
  }
}
