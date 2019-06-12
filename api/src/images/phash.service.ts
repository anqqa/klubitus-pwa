// tslint:disable:no-bitwise
import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';

const LOG_CONTEXT = 'PHash';

/* pHash with sharp, using implementation from sharp-phash. */
@Injectable()
export class PhashService {
  private LOW_SIZE = 8;
  private SAMPLE_SIZE = 32;

  private SQRT: number[] = [1 / Math.sqrt(2.0)].concat(new Array(this.SAMPLE_SIZE - 1).fill(1));

  private COS: number[][] = (() => {
    const cosines = new Array(this.SAMPLE_SIZE);

    for (let k = 0; k < this.SAMPLE_SIZE; k++) {
      cosines[k] = new Array(this.SAMPLE_SIZE);

      for (let n = 0; n < this.SAMPLE_SIZE; n++) {
        cosines[k][n] = Math.cos(((2 * k + 1) / (2.0 * this.SAMPLE_SIZE)) * n * Math.PI);
      }
    }

    return cosines;
  })();

  /**
   * Return a perceptual hash of an image.
   *
   * @param  image
   * @return  {Promise<Number>}
   */
  public phash(image: string): Promise<number> {
    Logger.debug('Calculating pHash...', LOG_CONTEXT);

    return sharp(image)
      .grayscale()
      .resize(this.SAMPLE_SIZE, this.SAMPLE_SIZE, { fit: 'fill' })
      .rotate()
      .raw()
      .toBuffer()
      .then(buffer => {
        // Create 2D array
        const s = new Array(this.SAMPLE_SIZE);

        for (let x = 0; x < this.SAMPLE_SIZE; x++) {
          s[x] = new Array(this.SAMPLE_SIZE);

          for (let y = 0; y < this.SAMPLE_SIZE; y++) {
            s[x][y] = buffer[this.SAMPLE_SIZE * y + x];
          }
        }

        // Apply 2D DCT
        const dct = this.applyDCT(s);

        // Average on high frequencies
        let totalSum = 0;

        for (let x = 0; x < this.LOW_SIZE; x++) {
          for (let y = 0; y < this.LOW_SIZE; y++) {
            totalSum += dct[x + 1][y + 1];
          }
        }

        const avg = totalSum / (this.LOW_SIZE * this.LOW_SIZE);

        // Compute hash
        let fingerprint = '';

        for (let x = 0; x < this.LOW_SIZE; x++) {
          for (let y = 0; y < this.LOW_SIZE; y++) {
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
  public phashDistance(a: number, b: number) {
    const bits = this.LOW_SIZE * this.LOW_SIZE;
    const A = Number(a)
      .toString(2)
      .padStart(bits, '0');
    const B = Number(b)
      .toString(2)
      .padStart(bits, '0');

    return A.split('').reduce((acc, val, idx) => acc + ~~(val !== B[idx]), 0);
  }

  private applyDCT(f: number[][]): number[][] {
    const F = new Array(this.SAMPLE_SIZE);

    for (let u = 0; u < this.SAMPLE_SIZE; u++) {
      F[u] = new Array(this.SAMPLE_SIZE);

      for (let v = 0; v < this.SAMPLE_SIZE; v++) {
        let sum = 0;

        for (let i = 0; i < this.SAMPLE_SIZE; i++) {
          for (let j = 0; j < this.SAMPLE_SIZE; j++) {
            sum += this.COS[i][u] * this.COS[j][v] * f[i][j];
          }
        }

        sum *= (this.SQRT[u] * this.SQRT[v]) / 4;
        F[u][v] = sum;
      }
    }

    return F;
  }
}
