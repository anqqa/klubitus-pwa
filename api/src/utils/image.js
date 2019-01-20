const exif = require('exif-reader');
const get = require('lodash').get;
const sharp = require('sharp');


/**
 * Calculate the dominant color of an image.
 *
 * @param  image
 * @return  {Promise<int[]>}
 */
const dominantColor = image => {
  console.log('Calculating dominant color...');

  return sharp(image)
    .resize(5, 5, { fit: sharp.fit.cover, position: sharp.strategy.attention })
    .toBuffer()
    .then(buffer => sharp(buffer).stats())
    .then(stats => {
      const { channels: [r, g, b] } = stats;

      return [Math.round(r.mean), Math.round(g.mean), Math.round(b.mean)];
    });
  /*
  image = self.convert_image_to_rgb(self.image.resize((150, 150)), alpha=self.alpha).quantize(colors=5)
  colors = image.getcolors()    # list of count, palette index
  palette = image.getpalette()  # r, g, b, r, g, b...
  dominant = max(colors)
  count, index = dominant
  color = palette[index * 3:index * 3 + 3]

  # If alpha is supported ignore black (most likely transparent)
  if self.alpha and color == [0, 0, 0]:
  colors.remove(dominant)

  dominant = max(colors)
  count, index = dominant
  color = palette[index * 3:index * 3 + 3]

  return "#{:02x}{:02x}{:02x}".format(*color)
  */
};

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

const exifParser = fullExif => {
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
      console.log('Could not parse EXIF tag', tag, ExifFields[tag], value);
    }
  }

  return parsedExif;
};


/**
 * Get image metadata and exif.
 *
 * @param  image
 * @return  {Promise<Object[]>}
 */
const metadata = image => {
  console.log('Getting metadata...');

  return sharp(image)
    .metadata()
    .then(metadata => {
      const fullExif   = exif(metadata.exif);
      const parsedExif = exifParser(fullExif);

      return [metadata, parsedExif];
    });
};


/* pHash with sharp, using implementation from sharp-phash. */
const LOW_SIZE    = 8;
const SAMPLE_SIZE = 32;

const SQRT = [1 / Math.sqrt(2.0)].concat(new Array(SAMPLE_SIZE - 1).fill(1));

const COS = (function() {
  let cosines = new Array(SAMPLE_SIZE);

  for (let k = 0; k < SAMPLE_SIZE; k++) {
    cosines[k] = new Array(SAMPLE_SIZE);

    for (let n = 0; n < SAMPLE_SIZE; n++) {
      cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * SAMPLE_SIZE)) * n * Math.PI);
    }
  }

  return cosines;
})();

const applyDCT = f => {
  const F = new Array(SAMPLE_SIZE);

  for (let u = 0; u < SAMPLE_SIZE; u++) {
    F[u] = new Array(SAMPLE_SIZE);

    for (let v = 0; v < SAMPLE_SIZE; v++) {
      let sum = 0;

      for (let i = 0; i < SAMPLE_SIZE; i++) {
        for (let j = 0; j < SAMPLE_SIZE; j++) {
          sum += COS[i][u] * COS[j][v] * f[i][j];
        }
      }

      sum *= (SQRT[u] * SQRT[v]) / 4;
      F[u][v] = sum;
    }
  }

  return F;
};

/**
 * Return a perceptual hash of an image.
 *
 * @param  image
 * @return  {Promise<Number>}
 */
const phash = image => {
  console.log('Calculating phash...');

  return sharp(image)
    .grayscale()
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: 'fill' })
    .rotate()
    .raw()
    .toBuffer()
    .then(buffer => {

      // Create 2D array
      const s = new Array(SAMPLE_SIZE);

      for (let x = 0; x < SAMPLE_SIZE; x++) {
        s[x] = new Array(SAMPLE_SIZE);

        for (let y = 0; y < SAMPLE_SIZE; y++) {
          s[x][y] = buffer[SAMPLE_SIZE * y + x];
        }
      }

      // Apply 2D DCT
      const dct = applyDCT(s, SAMPLE_SIZE);

      // Average on high frequencies
      let totalSum = 0;

      for (let x = 0; x < LOW_SIZE; x++) {
        for (let y = 0; y < LOW_SIZE; y++) {
          totalSum += dct[x + 1][y + 1];
        }
      }

      const avg = totalSum / (LOW_SIZE * LOW_SIZE);

      // Compute hash
      let fingerprint = '';

      for (let x = 0; x < LOW_SIZE; x++) {
        for (let y = 0; y < LOW_SIZE; y++) {
          fingerprint += dct[x + 1][y + 1] > avg ? '1' : '0';
        }
      }

      return parseInt(fingerprint, 2);
    });
};


/**
 * Calculate phash distance.
 *
 * @param  {Number}  a
 * @param  {Number}  b
 */
const phashDistance = (a, b) => {
  const bits = LOW_SIZE * LOW_SIZE;
  const A    = Number(a).toString(2).padStart(bits, '0');
  const B    = Number(b).toString(2).padStart(bits, '0');

  return A.reduce((acc, val, idx) => acc + ~~(val !== B[idx]), 0);
};


/**
 * Converts RGB array to HEX string.

 * @param  {number[]}  rgb
 * @return  {string}
 */
const rgb2hex = ([r, g, b]) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);


/**
 * Converts HEX to RGB array.
 *
 * @param  {string}  hex
 * @return  {number[]}
 */
const hex2rgb = hex => hex.match(/(\d{2})/g).map(c => parseInt(c, 16));


module.exports = {
  dominantColor,
  metadata,
  phash,
  phashDistance,
  rgb2hex,
  hex2rgb,
};
