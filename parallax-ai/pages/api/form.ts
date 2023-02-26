import { NextApiRequest, NextApiResponse } from 'next';
import { File, IncomingForm } from 'formidable';
import { JobState } from '../../clients/db';
import { uploadToS3 } from '../../clients/s3';
import { createJobRecord } from '../../clients/db';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./auth/[...nextauth]"

export const config = {
  api: {
    bodyParser: false,
    timeout: 600000,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const email = session.user?.email;
  if (!email) {
    return res.status(401).json({ message: 'Email fetching error' });
  }
  
  const form = new IncomingForm({multiples:true});
  const id = randomUUID();
  const TS_NOW = Math.floor(Date.now() / 1000);
  const photos: File[] = await new Promise(function (resolve, reject) {
    form.parse(req, function (err, fields, files) {
        if (err) {
            reject(err);
            return;
        }
        resolve(files.photos as File[]);
    });
  });

  const trainingDataUrl = await uploadToS3(email, (photos as File[]).map((file: File) => file.filepath))
  if (!trainingDataUrl) {
    return res.status(500).json({ message: 'Error uploading to S3' });
  }
  const data = await createJobRecord({id: id, timestamp: TS_NOW, email: email, jobState: JobState.PENDING, trainingDataUrl: trainingDataUrl, modelId: null, modelUrl: null, outputIds: null, outputUrls: null});

  return res.redirect(307, '/dashboard')
}

