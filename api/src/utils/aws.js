const AWS = require('aws-sdk');
const fs = require('fs');
const mimeTypes = require('mime-types');

const log = require('../utils/log');


const AWSOptions = {
  accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:          process.env.AWS_DEFAULT_REGION,
};

const deleteFile = sourceKey => {
  log.info('Deleting file', sourceKey);

  const s3 = new AWS.S3(AWSOptions);

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key:    sourceKey,
  };

  return s3.deleteObject(params).promise();
};


const detectLabels = sourceKey => {
  log.info('Detecting labels', sourceKey);

  const rekognition = new AWS.Rekognition(AWSOptions);

  const params = {
    Image: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name:   sourceKey,
      },
    },
    MinConfidence: 70.0,
  };

  return rekognition.detectLabels(params).promise();
};


const getKeyForImage = filename => {
  return `${process.env.AWS_IMAGE_PREFIX}${filename.split('', 2).join('/')}/${filename}`;
};


const uploadToS3 = (sourcePath, targetKey) => {
  log.info('Uploading to S3', sourcePath, targetKey);

  const s3 = new AWS.S3(AWSOptions);

  const params = {
    ACL:         'public-read',
    Body:        fs.createReadStream(sourcePath),
    Bucket:      process.env.AWS_BUCKET,
    ContentType: mimeTypes.lookup(sourcePath),
    Key:         targetKey,
  };

  return s3.upload(params).promise();
};


module.exports = {
  deleteFile,
  detectLabels,
  getKeyForImage,
  uploadToS3,
};
