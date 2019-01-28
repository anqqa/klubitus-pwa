const get = require('lodash').get;

const log = require('../utils/log');


/**
 * @see  https://sno.phy.queensu.ca/~phil/exiftool/TagNames/EXIF.html
 */
const ExifFields = {
  altitude:      'gps.GPSAltitude',
  altitude_ref:  'gps.GPSAltitudeRef',
  aperture:      'exif.FNumber',
  created_at:    'exif.DateTimeOriginal',
  exposure:      'exif.ExposureTime',
  flash:         'exif.Flash',
  focal:         'exif.FocalLength',
  iso:           'exif.ISO',
  latitude:      'gps.GPSLatitude',
  latitude_ref:  'gps.GPSLatitudeRef',
  lens_make:     'exif.LensMake',
  lens_model:    'exif.LensModel',
  longitude:     'gps.GPSLongitude',
  longitude_ref: 'gps.GPSLongitudeRef',
  make:          'image.Make',
  metering:      'exif.MeteringMode',
  model:         'image.Model',
  program:       'exif.ExposureProgram',
};

const ExposureProgram = [
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

const FlashMode = {
  0x0:  'No Flash',
  0x1:  'Fired',
  0x5:  'Fired, Return not detected',
  0x7:  'Fired, Return detected',
  0x8:  'On, Did not fire',
  0x9:  'On, Fired',
  0xd:  'On, Return not detected',
  0xf:  'On, Return detected',
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

const MeteringMode = [
  'Unknown',
  'Average',
  'Center-weighted average',
  'Spot',
  'Multi-spot',
  'Multi-segment',
  'Partial',
];

const parseExif = fullExif => {
  log.info('Parsing EXIF...');

  let parsedExif = {};

  for (const tag in ExifFields) {
    const value = get(fullExif, ExifFields[tag], null);

    try {
      if (value !== null) {
        switch (tag) {

          case 'altitude_ref':
            parsedExif[`${tag}_value`] = value;
            parsedExif[tag] = value ? '-' : '+';
            break;

          case 'exposure':
            parsedExif[`${tag}_value`] = value;
            parsedExif[tag] = value > 1 ? value : `1/${Math.round(1 / value)}`;
            break;

          case 'flash':
            parsedExif[`${tag}_value`] = value;
            parsedExif[tag] = FlashMode[value];
            break;

          case 'latitude':
          case 'longitude':
            parsedExif[tag] = value[0] + value[1] / 60 + value[2] / 3600;
            break;

          case 'metering':
            parsedExif[`${tag}_value`] = value;
            parsedExif[tag] = MeteringMode[value];
            break;

          case 'program':
            parsedExif[`${tag}_value`] = value;
            parsedExif[tag] = ExposureProgram[value];
            break;

          default:
            parsedExif[tag] = value;
        }
      }
    }
    catch (error) {
      log.warn('Could not parse EXIF tag', tag, ExifFields[tag], value);
    }
  }

  return parsedExif;
};


module.exports = {
  parseExif,
};
