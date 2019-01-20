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


module.exports = {
  dominantColor,
  phash,
  phashDistance,
};
