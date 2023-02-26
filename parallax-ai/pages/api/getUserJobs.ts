import { getJobRecordByEmail } from '@/clients/db';
import { NextApiRequest, NextApiResponse } from 'next';
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
  const userJobs = await getJobRecordByEmail(email)
  return res.status(200).json({ userJobs: userJobs });
}

