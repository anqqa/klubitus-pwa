import { Injectable, Logger } from '@nestjs/common';
import { Metadata } from 'sharp';
import * as sharp from 'sharp';

import { ExifService } from './exif.service';

const LOG_CONTEXT = 'ImageMeta';

@Injectable()
export class MetaService {
  /**
   * Get image metadata and EXIF.
   */
  static metadata(image: string): Promise<[Metadata, Record<string, number | string>]> {
    Logger.debug('Getting metadata...', LOG_CONTEXT);

    return sharp(image)
      .metadata()
      .then(metadata => {
        const parsedExif = metadata.exif && ExifService.parse(metadata.exif);

        return [metadata, parsedExif];
      });
  }
}
