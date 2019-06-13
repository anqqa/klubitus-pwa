// tslint:disable:no-bitwise
import { Logger } from '@nestjs/common';
import * as sharp from 'sharp';

const LOG_CONTEXT = 'PHash';
const LOW_SIZE = 8;
const SAMPLE_SIZE = 32;

const SQRT: number[] = [1 / Math.sqrt(2.0)].concat(new Array(SAMPLE_SIZE - 1).fill(1));

const COS: number[][] = (() => {
  const cosines = new Array(SAMPLE_SIZE);

  for (let k = 0; k < SAMPLE_SIZE; k++) {
    cosines[k] = new Array(SAMPLE_SIZE);

    for (let n = 0; n < SAMPLE_SIZE; n++) {
      cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * SAMPLE_SIZE)) * n * Math.PI);
    }
  }

  return cosines;
})();

/* pHash with sharp, using implementation from sharp-phash. */
export class PhashUtil {
  /**
   * Return a perceptual hash of an image.
   *
   * @param  image
   * @return  {Promise<Number>}
   */
  static phash(image: string): Promise<number> {
    Logger.debug('Calculating pHash...', LOG_CONTEXT);

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
        const dct = PhashUtil.applyDCT(s);

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
  }

  /**
   * Calculate phash distance.
   *
   * @param  {Number}  a
   * @param  {Number}  b
   */
  static phashDistance(a: number, b: number) {
    const bits = LOW_SIZE * LOW_SIZE;
    const A = Number(a)
      .toString(2)
      .padStart(bits, '0');
    const B = Number(b)
      .toString(2)
      .padStart(bits, '0');

    return A.split('').reduce((acc, val, idx) => acc + ~~(val !== B[idx]), 0);
  }

  private static applyDCT(f: number[][]): number[][] {
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
  }
}
