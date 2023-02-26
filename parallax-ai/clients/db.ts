import { DynamoDB } from 'aws-sdk';

//initialize dynamo db
const dynamoDb = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

//function to create record in dynamo db using JobRecord interface
export const createJobRecord = async (item: JobRecord) => {
    const params = {
      TableName: 'parallax-ai-jobs',
      Item: item,
    };  
    await dynamoDb.put(params).promise();
    return item;
};

//function to fetch record from dynamo db using JobRecord interface by jobState
export const getJobRecordByState = async (jobState: JobState) => {
    const params = {
        TableName: 'parallax-ai-jobs',
        IndexName: 'jobState-index',
        KeyConditionExpression: 'jobState = :jobState',
        ExpressionAttributeValues: {
            ':jobState': jobState,
        },
    };
    return await (await dynamoDb.query(params).promise()).Items as JobRecord[];
};

//function to fetch record from dynamo db using JobRecord interface by email
export const getJobRecordByEmail = async (email: string) => {
    const params = {
        TableName: 'parallax-ai-jobs',
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email,
        },
    };

    return await (await dynamoDb.query(params).promise()).Items as JobRecord[];
};


//function to partially update record in dynamo db
export const updateJobRecord = async (item: JobRecord) => {
    const params = {
        TableName: 'parallax-ai-jobs',
        Key: {
            id: item.id,
        },
        UpdateExpression: 'set jobState = :jobState, modelId = :modelId, modelUrl = :modelUrl, outputIds = :outputIds, outputUrls = :outputUrls',
        ExpressionAttributeValues: {
            ':jobState': item.jobState ?? null,
            ':modelId': item.modelId ?? null,
            ':modelUrl': item.modelUrl ?? null,
            ':outputIds': item.outputIds ?? null,
            ':outputUrls': item.outputUrls ?? null,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    return await dynamoDb.update(params).promise();
};

// create Jobr Record interface with email, job status as enum, model_url and id
export interface JobRecord {
    id: string;
    timestamp: number;
    email: string;
    trainingDataUrl: string;
    jobState: JobState;
    modelId: string | null;
    modelUrl: string | null;
    outputIds: string[] | null;
    outputUrls: string[] | null;
  }
  
  export enum JobState {
      PENDING = 'PENDING',
      MODEL_CREATING = 'MODEL_CREATING',
      MODEL_CREATED = 'MODEL_CREATED',
      INFERENCING = 'INFERENCING',
      COMPLETED = 'COMPLETED'
  }
  