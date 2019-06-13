import { Logger } from '@nestjs/common';
import { Metadata } from 'sharp';
import * as sharp from 'sharp';

import { ExifUtil } from './exif.util';

const LOG_CONTEXT = 'ImageMeta';

export class MetadataUtil {
  /**
   * Get image getMetadataAndExif and EXIF.
   */
  static getMetadataAndExif(image: string): Promise<[Metadata, Record<string, number | string>]> {
    Logger.debug('Getting getMetadataAndExif...', LOG_CONTEXT);

    return sharp(image)
      .metadata()
      .then(metadata => {
        const parsedExif = metadata.exif && ExifUtil.parse(metadata.exif);

        return [metadata, parsedExif];
      });
  }
}
