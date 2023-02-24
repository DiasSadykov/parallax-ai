//cron api to fetch data from dynamo db send api request and send email

import { NextApiRequest, NextApiResponse } from 'next';
import { getJobRecordByState, JobState, updateJobRecord } from './db';
import { checkModelCreation, createKazakhStyledInference, createModel } from './replicateClient';


export default async (_: NextApiRequest, res: NextApiResponse) => {
    const pendingJobs = await getJobRecordByState(JobState.PENDING);
    for (const job of pendingJobs) {
        const id = await createModel(job.trainingDataUrl);
        if (id) {
            job.jobState = JobState.MODEL_CREATING;
            job.modelId = id;
            await updateJobRecord(job);
        }
    }
    const modelCreationJobs = await getJobRecordByState(JobState.MODEL_CREATING);
    for (const job of modelCreationJobs) {
        const modelUrl = await checkModelCreation(job.modelId);
        if (modelUrl.output) {
            console.log(modelUrl.output)
            job.jobState = JobState.MODEL_CREATED;
            job.modelUrl = modelUrl.output;
            await updateJobRecord(job);
        }

    }
    const modelCreatedJob = await getJobRecordByState(JobState.MODEL_CREATED);
    for (const job of modelCreatedJob) {
        const response = await createKazakhStyledInference(job.modelUrl);
        if (response) {
            console.log(response)
        }
    }
    res.status(200).json({ pendingJobs, modelCreationJobs, modelCreatedJob, message: 'Cron job ran successfully' });
};







