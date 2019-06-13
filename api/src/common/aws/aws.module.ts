import { DynamicModule, Module, Provider } from '@nestjs/common';

import { S3Client } from './s3.client';

@Module({})
export class AwsModule {
  public static forRoot(
    region: string,
    bucket: string,
    prefix: string,
    accessKeyId: string,
    secretAccessKey: string,
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: S3Client,
        useValue: new S3Client(region, bucket, prefix, accessKeyId, secretAccessKey),
      } as any,
    ];

    return {
      exports: providers,
      module: AwsModule,
      providers,
    };
  }
}
