import archiver from 'archiver';
import stream, { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadToS3FromUrls = async (basePath: string, urls: string[]): Promise<string[]> => {
    const uploadToS3 = async (url: string) => {
      const pass = new stream.PassThrough();
      const request = require('request');
      request(url).pipe(pass);
      const imageUrl = await s3.upload({
          Bucket: 'parallax-ai-output',
          Key: basePath + '/' +  randomUUID() + '.jpg',
          Body: pass,
      }).promise().then((data) => {return data.Location}).catch((err) => {console.log(err); return null});
      return imageUrl;
    };
    return (await Promise.all(urls.map(uploadToS3))).filter((url) => url != null) as string[];
}

