import { NextApiRequest, NextApiResponse } from 'next';
import { File, IncomingForm } from 'formidable';
import { JobState } from './db';
import { uploadToS3 } from './s3';
import { createJobRecord } from './db';
import { randomUUID } from 'crypto';


export const config = {
  api: {
    bodyParser: false,
    timeout: 600000,
  },
};

// make parse form data asynchronus


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new IncomingForm({multiples:true});
  const id = randomUUID();
  const TS_NOW = Math.floor(Date.now() / 1000);
  const [email, photos]: [string, File[]] = await new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
        if (err) {
            reject(err);
            return;
        }
        resolve([fields.email as string, files.photos as File[]]);
    });
  });
  const trainingDataUrl = await uploadToS3(email as string, (photos as File[]).map((file: File) => file.filepath))
  if (!trainingDataUrl) {
    return res.status(500).json({ message: 'Error uploading to S3' });
  }
  const data = await createJobRecord({id: id, timestamp: TS_NOW, email: email as string, jobState: JobState.PENDING, trainingDataUrl: trainingDataUrl, modelId: null, modelUrl: null, outputUrl: null});

  return res.status(200).json({ message: data });
}

