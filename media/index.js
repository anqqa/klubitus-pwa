'use strict';

const AWS   = require('aws-sdk');
const mime  = require('mime-types');
const S3    = new AWS.S3({ signatureVersion: 'v4' });
const Sharp = require('sharp');

const BUCKET              = process.env.BUCKET;
const URL                 = process.env.URL;
const ALLOWED_RESOLUTIONS = process.env.ALLOWED_RESOLUTIONS
  ? new Set(process.env.ALLOWED_RESOLUTIONS.split(/\s*,\s*/))
  : new Set([]);
const ALLOWED_TARGETS     = new Set((process.env.ALLOWED_TARGETS || 'jpeg,png,webp').split(/\s*,\s*/));

exports.handler = function(event, context, callback) {
  const key   = event.queryStringParameters.key;

  console.log(`Received ${key}`);

  //  const match = key.match(/((\d+)x(\d+))\/(.*)/);
  // Matches r/123x456/some/path/file.png.webp
  // const match = key.match(/(?<method>\w)\/(?<res>(?<width>\d+)x(?<height>\d+))\/(?<orig>([^.]+)\.(\w+))(\.(?<target>\w+))?/);
  const match = key.match(/(\w)\/((\d+)x(\d+))\/(([^.]+)\.(\w+))(\.(\w+))?/);

  if (!match) {
    console.log(' - no match');

    callback(null, { body: '', headers: {}, statusCode: '404' });

    return;
  }

  const [full, method, res, width, height, orig, name, filetype, targetExt, target] = match;

  if (method !== 'r') {
    console.log(' - invalid method', method);

    callback(null, { body: '', headers: {}, statusCode: '403' });

    return;
  }

  // Check if requested resolution is allowed
  if (ALLOWED_RESOLUTIONS.size !== 0 && !ALLOWED_RESOLUTIONS.has(res)) {
    console.log(' - resolution not allowed', res, ALLOWED_RESOLUTIONS);

    callback(null, { body: '', headers: {}, statusCode: '403' });

    return;
  }

  // Check if requested format is allowed
  if (target && !ALLOWED_TARGETS.has(target)) {
    console.log(' - target not allowed', target, ALLOWED_TARGETS);

    callback(null, { body: '', headers: {}, statusCode: '403' });

    return;
  }

  const targetWidth  = parseInt(width, 10) || null;
  const targetHeight = parseInt(height, 10) || null;
  const originalKey  = orig;

  console.log(` - resizing ${originalKey} to ${targetWidth || 'auto'}x${targetHeight || 'auto'} ${target || ''}`);

  S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise()
    .then(data => Sharp(data.Body)
      .resize(targetWidth, targetHeight)
      .crop(Sharp.strategy.attention)
      .jpeg({ force: target === 'jpeg' })
      .png({ force: target === 'png' })
      .webp({ force: target === 'webp' })
      .toBuffer()
    )
    .then(buffer => S3.putObject({
        Body:        buffer,
        Bucket:      BUCKET,
        ContentType: mime.lookup(target || originalKey),
        Key:         key,
      }).promise()
    )
    .then(() => callback(null, {
        statusCode: '301',
        headers:    { 'location': `${URL}/${key}` },
        body:       '',
      })
    )
    .catch(err => callback(err))
};
