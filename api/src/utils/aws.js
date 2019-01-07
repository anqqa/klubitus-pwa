const AWS = require('aws-sdk');
const fs = require('fs');
const mimeTypes = require('mime-types');


const getKeyForImage = filename => {
  return `${process.env.AWS_IMAGE_PREFIX}${filename.split('', 2).join('/')}/${filename}`;
};


const uploadToS3 = (sourcePath, targetKey) => {
  const s3 = new AWS.S3({
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region:          process.env.AWS_DEFAULT_REGION,
  });

  const params = {
    ACL:         'public-read',
    Body:        fs.createReadStream(sourcePath),
    Bucket:      process.env.AWS_BUCKET,
    ContentType: mimeTypes.lookup(sourcePath),
    Key:         targetKey,
  };

  console.log('Uploading', sourcePath, targetKey);

  return s3.upload(params).promise();
};


module.exports = {
  getKeyForImage,
  uploadToS3,
};
