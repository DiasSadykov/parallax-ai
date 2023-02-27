import { NextApiRequest, NextApiResponse } from 'next';
import { File, IncomingForm } from 'formidable';
import { JobState } from '../../clients/db';
import { uploadToS3 } from '../../clients/s3';
import { createJobRecord } from '../../clients/db';
import { randomUUID } from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./auth/[...nextauth]"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const email = session.user?.email;
  if (!email) {
    return res.status(401).json({ message: 'Email fetching error' });
  }
  console.log(req)
  if (!req.body.trainingDataUrl){
    return res.status(400).json({ message: 'No training data' });
  }
  const id = randomUUID();
  const TS_NOW = Math.floor(Date.now() / 1000);
  const data = await createJobRecord({id: id, timestamp: TS_NOW, email: email, jobState: JobState.PENDING, trainingDataUrl: req.body.trainingDataUrl, modelId: null, modelUrl: null, outputIds: null, outputUrls: null});

  return res.status(200).json({ message: 'Success', id: data.id });
}

