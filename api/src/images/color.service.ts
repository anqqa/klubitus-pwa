// tslint:disable:no-bitwise
import { Logger } from '@nestjs/common';
import * as sharp from 'sharp';

const LOG_CONTEXT = 'Color';

export class ColorService {
  /**
   * Calculate the dominant color of an image.
   */
  static dominantColor(image: string): Promise<[number, number, number]> {
    Logger.debug('Calculating dominant color', LOG_CONTEXT);

    return sharp(image)
      .resize(5, 5, { fit: sharp.fit.cover, position: sharp.strategy.attention })
      .toBuffer()
      .then(buffer => sharp(buffer).stats())
      .then(stats => {
        const {
          channels: [r, g, b],
        } = stats;

        return [Math.round(r.mean), Math.round(g.mean), Math.round(b.mean)];
      });
  }

  /**
   * Converts HEX to RGB array.
   *
   * @param  {string}  hex
   * @return  {number[]}
   */
  static hex2rgb(hex: string): number[] {
    return hex.match(/(\d{2})/g).map(c => parseInt(c, 16));
  }

  /**
   * Converts RGB array to HEX string.
   *
   * @param  {number[]}  rgb
   * @return  {string}
   */
  static rgb2hex([r, g, b]: number[]): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
