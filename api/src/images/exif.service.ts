import { Injectable, Logger } from '@nestjs/common';
import { get } from 'lodash';

// tslint:disable-next-line:no-var-requires
const exifReader = require('exif-reader');

const LOG_CONTEXT = 'EXIF';

/**
 * @see  https://sno.phy.queensu.ca/~phil/exiftool/TagNames/EXIF.html
 */
const ExifFields: Record<string, string> = {
  altitude: 'gps.GPSAltitude',
  altitude_ref: 'gps.GPSAltitudeRef',
  aperture: 'exif.FNumber',
  created_at: 'exif.DateTimeOriginal',
  exposure: 'exif.ExposureTime',
  flash: 'exif.Flash',
  focal: 'exif.FocalLength',
  iso: 'exif.ISO',
  latitude: 'gps.GPSLatitude',
  latitude_ref: 'gps.GPSLatitudeRef',
  lens_make: 'exif.LensMake',
  lens_model: 'exif.LensModel',
  longitude: 'gps.GPSLongitude',
  longitude_ref: 'gps.GPSLongitudeRef',
  make: 'image.Make',
  metering: 'exif.MeteringMode',
  model: 'image.Model',
  program: 'exif.ExposureProgram',
};

const ExposureProgram: string[] = [
  'Not Defined',
  'Manual',
  'Program AE',
  'Aperture-priority AE',
  'Shutter speed priority AE',
  'Creative (Slow speed)',
  'Action (High speed)',
  'Portrait',
  'Landscape',
  'Bulb',
];

const FlashMode: Record<number, string> = {
  0x0: 'No Flash',
  0x1: 'Fired',
  0x5: 'Fired, Return not detected',
  0x7: 'Fired, Return detected',
  0x8: 'On, Did not fire',
  0x9: 'On, Fired',
  0xd: 'On, Return not detected',
  0xf: 'On, Return detected',
  0x10: 'Off, Did not fire',
  0x14: 'Off, Did not fire, Return not detected',
  0x18: 'Auto, Did not fire',
  0x19: 'Auto, Fired',
  0x1d: 'Auto, Fired, Return not detected',
  0x1f: 'Auto, Fired, Return detected',
  0x20: 'No flash function',
  0x30: 'Off, No flash function',
  0x41: 'Fired, Red-eye reduction',
  0x45: 'Fired, Red-eye reduction, Return not detected',
  0x47: 'Fired, Red-eye reduction, Return detected',
  0x49: 'On, Red-eye reduction',
  0x4d: 'On, Red-eye reduction, Return not detected',
  0x4f: 'On, Red-eye reduction, Return detected',
  0x50: 'Off, Red-eye reduction',
  0x58: 'Auto, Did not fire, Red-eye reduction',
  0x59: 'Auto, Fired, Red-eye reduction',
  0x5d: 'Auto, Fired, Red-eye reduction, Return not detected',
  0x5f: 'Auto, Fired, Red-eye reduction, Return detected',
};

const MeteringMode: string[] = [
  'Unknown',
  'Average',
  'Center-weighted average',
  'Spot',
  'Multi-spot',
  'Multi-segment',
  'Partial',
];

@Injectable()
export class ExifService {
  static parse(exifBuffer: Buffer): Record<string, string | number> {
    Logger.debug('Parsing EXIF...', LOG_CONTEXT);

    const exif = exifReader(exifBuffer);

    if (!exif) {
      return null;
    }

    const parsed: Record<string, string | number> = {};

    for (const [tag, field] of Object.entries(ExifFields)) {
      const value = get(exif, field, null);

      try {
        if (value !== null) {
          switch (tag) {
            case 'altitude_ref':
              parsed[`${tag}_value`] = value;
              parsed[tag] = value ? '-' : '+';
              break;

            case 'exposure':
              parsed[`${tag}_value`] = value;
              parsed[tag] = value > 1 ? value : `1/${Math.round(1 / value)}`;
              break;

            case 'flash':
              parsed[`${tag}_value`] = value;
              parsed[tag] = FlashMode[value];
              break;

            case 'latitude':
            case 'longitude':
              parsed[tag] = value[0] + value[1] / 60 + value[2] / 3600;
              break;

            case 'metering':
              parsed[`${tag}_value`] = value;
              parsed[tag] = MeteringMode[value];
              break;

            case 'program':
              parsed[`${tag}_value`] = value;
              parsed[tag] = ExposureProgram[value];
              break;

            default:
              parsed[tag] = value;
          }
        }
      } catch (error) {
        Logger.warn(`Could not parse tag ${tag} (${field}): ${value}`, LOG_CONTEXT);
      }
    }

    return parsed;
  }
}
