import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform<object, object> {
  transform(value: object, metadata: ArgumentMetadata): any {
    const trimPair = (acc: object, [k, v]: [string, any]) => ({
      ...acc,
      [k]: typeof v === 'string' ? v.trim() : v,
    });

    return Object.entries(value).reduce(trimPair, {});
  }
}
