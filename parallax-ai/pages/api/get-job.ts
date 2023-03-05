import { getJobRecordById } from '@/clients/db';
import { NextApiRequest, NextApiResponse } from 'next';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const jobs = await getJobRecordById(req.body.id);
  if (!jobs) {
    return res.status(401).json({ message: 'No jobs' });
  }
  return res.status(200).json({ job: jobs[0] });
}
