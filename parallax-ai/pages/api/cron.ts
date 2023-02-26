//cron api to fetch data from dynamo db send api request and send email

import { NextApiRequest, NextApiResponse } from 'next';
import { getJobRecordByState, JobState, updateJobRecord } from '../../clients/db';
import { checkModelCreation, createKazakhStyledInference, createModel } from '../../clients/replicateClient';


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
        const inferenceIds = await Promise.all([
            createKazakhStyledInference(job.modelUrl),
            createKazakhStyledInference(job.modelUrl),
            createKazakhStyledInference(job.modelUrl),
            createKazakhStyledInference(job.modelUrl),
          ]);
        for (const id of inferenceIds) {
            if (id) {
                job.outputIds = [...(job.outputIds ?? []), id];
            }
        }
        job.jobState = JobState.INFERENCING;
        await updateJobRecord(job);
    }

    const inferencingJobs = await getJobRecordByState(JobState.INFERENCING);
    let finalized = true;
    for (const job of inferencingJobs) {
        if (job.outputIds) {
            const inferences = await Promise.all(job.outputIds.map((id) => checkModelCreation(id)));
            for (const inference of inferences) {
                if (inference.output) {
                    job.outputUrls = [...(job.outputUrls ?? []), ...inference.output];
                }
                if (inference && inference.status !== 'succeeded') {
                    finalized = false;
                }
            }
        }
        if (finalized){
            job.jobState = JobState.COMPLETED;
            await updateJobRecord(job);
        }
    }

    res.status(200).json({ pendingJobs, modelCreationJobs, modelCreatedJob, inferencingJobs, message: 'Cron job ran successfully' });
};







