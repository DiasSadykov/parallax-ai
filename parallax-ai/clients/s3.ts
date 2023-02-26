import archiver from 'archiver';
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadToS3 = async (email: string, paths: string[]) => {
    const zip = new PassThrough();
    const zipArchive = archiver('zip', { zlib: { level: 9 } });
    zipArchive.pipe(zip);
    let offset = 0;
    for (const path of paths) {
      zipArchive.file(path, {name: 'train'+offset+'.jpg'});
      offset++;
    }

    zipArchive.finalize();
    zipArchive.on('end', function() {
      console.log('Archive wrote %d bytes', zipArchive.pointer());
    });

    const params = {
      Bucket: 'parallax-ai',
      Key: email+'.zip',
      Body: zip,
      ContentType: 'application/zip',
    };

    const request = s3.upload(params).promise();
    const location = (await request).Location
    console.log('uploaded to s3', location)
    return location
  };

