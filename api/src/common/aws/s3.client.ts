import { Injectable, Logger } from '@nestjs/common';
import * as aws from 'aws-sdk';
import { DetectLabelsResponse } from 'aws-sdk/clients/rekognition';
import { DeleteObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3';
import { createReadStream } from 'fs';
import { lookup } from 'mime-types';

const LOG_CONTEXT = 'AWS';

@Injectable()
export class S3Client {
  private rekognition: aws.Rekognition;
  private s3: aws.S3;

  constructor(
    private region: string,
    private bucket: string,
    private prefix: string,
    private accessKeyId: string,
    private secretAccessKey: string,
  ) {
    const options = {
      accessKeyId: this.accessKeyId,
      region: this.region,
      secretAccessKey: this.secretAccessKey,
    };

    this.rekognition = new aws.Rekognition(options);
    this.s3 = new aws.S3(options);
  }

  public delete(target: string): Promise<DeleteObjectOutput> {
    Logger.debug(`Deleting ${target}`, LOG_CONTEXT);

    return new Promise<DeleteObjectOutput>(
      (resolve: (data: DeleteObjectOutput) => void, reject: (err: Error) => void): void => {
        const params = {
          Bucket: this.bucket,
          Key: target,
        };

        this.s3.deleteObject(params, (err: Error, data: DeleteObjectOutput) => {
          if (err) {
            Logger.debug(`Failed to delete ${target}`, LOG_CONTEXT);

            reject(err);
          } else {
            Logger.debug(`Deleted ${target}`, LOG_CONTEXT);

            resolve(data);
          }
        });
      },
    );
  }

  public detectLabels(target: string): Promise<DetectLabelsResponse> {
    Logger.debug(`Detecting labels of ${target}`, LOG_CONTEXT);

    return new Promise(
      (resolve: (data: DetectLabelsResponse) => void, reject: (err: Error) => void): void => {
        const params = {
          Image: {
            S3Object: {
              Bucket: this.bucket,
              Name: target,
            },
          },
          MinConfidence: 70.0,
        };

        this.rekognition.detectLabels(params, (err: Error, data: DetectLabelsResponse) => {
          if (err) {
            Logger.debug(`Failed to detect labels of ${target}`, LOG_CONTEXT);

            reject(err);
          } else {
            Logger.debug(`Labels detected for ${target}`, LOG_CONTEXT);

            resolve(data);
          }
        });
      },
    );
  }

  public getKeyForImage(filename: string) {
    return `${this.prefix}${filename.split('', 2).join('/')}/${filename}`;
  }

  public upload(
    source: string,
    target: string,
    ACL: string = 'public-read',
  ): Promise<ManagedUpload.SendData> {
    Logger.debug(`Uploading ${target}`, LOG_CONTEXT);

    return new Promise<ManagedUpload.SendData>(
      (resolve: (data: ManagedUpload.SendData) => void, reject: (err: Error) => void): void => {
        const params = {
          ACL,
          Body: createReadStream(source),
          Bucket: this.bucket,
          ContentType: lookup(source) as string,
          Key: target,
        };

        this.s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
          if (err) {
            Logger.debug(`Failed to upload ${target}`, LOG_CONTEXT);

            reject(err);
          } else {
            Logger.debug(`Uploaded ${target}`, LOG_CONTEXT);

            resolve(data);
          }
        });
      },
    );
  }
}
