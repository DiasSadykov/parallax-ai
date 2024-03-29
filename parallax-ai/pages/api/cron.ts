//cron api to fetch data from dynamo db send api request and send email

import { sendAvatars } from '@/clients/emails';
import { uploadToS3FromUrls } from '@/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';
import { getJobRecordByState, JobState, updateJobRecord } from '../../clients/db';
import { checkModelCreation, checkOutput, createInferences, createModel } from '../../clients/replicateClient';

const CHUNK_SIZE = process.env.CHUNK_SIZE ? parseInt(process.env.CHUNK_SIZE) : 3;

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

    function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        if (value === null || value === undefined) {
            console.log("Didn't find value for id")
        }
        return value !== null && value !== undefined;
    }

    const modelCreatedJob = await getJobRecordByState(JobState.MODEL_CREATED);
    for (const job of modelCreatedJob) {
        const inferenceIds = await createInferences(job.modelUrl);
        const inferenceIdsNonEmpty = inferenceIds.filter(notEmpty);
        if (inferenceIdsNonEmpty.length > 0) {
            job.outputIds = inferenceIdsNonEmpty;
            job.jobState = JobState.INFERENCING;
            await updateJobRecord(job);
        }
    }

    const inferencingJobs = await getJobRecordByState(JobState.INFERENCING);

    for (const job of inferencingJobs) {
        if (job.outputIds) {
            const newOutputIds = job.outputIds.slice(CHUNK_SIZE);
            const idOutputs = await Promise.all(job.outputIds.slice(0,CHUNK_SIZE).map((id) => checkOutput(id)));
            for (const idOutput of idOutputs) {
                const [id, urls] = idOutput;
                if (!id) {
                    continue;
                }
                if (urls) {
                    job.outputUrls = [...(job.outputUrls ?? []), ...(await uploadToS3FromUrls((job.email + '/' +job.id), urls))];
                    console.log("Uploaded to s3", job.outputUrls.length)
                }
                if (!urls) {
                    newOutputIds.push(id);
                }
            }
            job.outputIds = newOutputIds;
            if (job.outputIds.length === 0) {
                job.jobState = JobState.INFERENCING_COMPLETED;
            }
            await updateJobRecord(job);
        }
    }

    const inferencingCompletedJobs = await getJobRecordByState(JobState.INFERENCING_COMPLETED);

    for (const job of inferencingCompletedJobs) {
        try{
            await sendAvatars(job.email, job.id);
            job.jobState = JobState.FINISHED;
            await updateJobRecord(job);
        } catch (e) {
            console.log(e);
        }
    }

    res.status(200).json({ pendingJobs, modelCreationJobs, modelCreatedJob, inferencingJobs, message: 'Cron job ran successfully' });
};
