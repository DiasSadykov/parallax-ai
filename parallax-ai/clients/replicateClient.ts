//function createModel to make post request to replicate.com and return job url

import { INFERENCES_REQUESTS } from "./infences";

const MODEL_URL_BASE ="https://api.replicate.com/v1/predictions"

const postApiRequest = async (url: string, body: any) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token a7d0d3bbaa3828665932020b7fc66587ac34faaf'
        },
        body: JSON.stringify(body),
    });
    return await response.json();
};

const getApiRequest = async (url: string) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token a7d0d3bbaa3828665932020b7fc66587ac34faaf'
        },
    });
    return await response.json();
};

export const createModel = async (trainingDataUrl: string) => {
    const url = 'https://api.replicate.com/v1/predictions';
    const body = {
        version: "b2a308762e36ac48d16bfadc03a65493fe6e799f429f7941639a6acec5b276cc",
        input: {
            instance_data: trainingDataUrl,
            task: "face",
        }
      };
      return await postApiRequest(url, body).then((response) => {return response.id}).catch((error) => {console.log(error); return null});
};

export const checkModelCreation = async (id: string | null): Promise<any | null> => {
    if (!id) {
        return null;
    }
    const modelCreationUrl = MODEL_URL_BASE + "/" + id;
    const response = await getApiRequest(modelCreationUrl).then((response) => {return response}).catch((error) => {console.log(error); return null})
    return response
};

export const checkOutput = async (id: string | null): Promise<[string | null, string[]| null]> => {
    if (!id) {
        return [null, null];
    }
    const modelCreationUrl = MODEL_URL_BASE + "/" + id;
    const output = await getApiRequest(modelCreationUrl).then((response) => {return response.output}).catch((error) => {console.log(error); return [id, null]})
    return [id, output]
};

export const createInference = async (body: any): Promise<string | null>=> {
    const id = await postApiRequest(MODEL_URL_BASE, body).then((response) => {return response.id}).catch((error) => {console.log(error); return null})
    return id
};

export const createInferences = async (modelUrl: string | null): Promise<(string | null)[]>=> {
    const BASE_INFERENCE_INPUT = {
        num_outputs: 4,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        scheduler: "K_EULER_ANCESTRAL",
        height: 512,
        width: 512,
    };
    const inferenceIds: (string | null )[] = await Promise.all(INFERENCES_REQUESTS.map(
        async (inferenceRequest) => {
            const inferenceInput = {
                ...BASE_INFERENCE_INPUT,
                ...inferenceRequest,
                lora_urls: modelUrl + inferenceRequest.lora_urls,
            }
            const inferenceBody = {
                version: "300e401c9899d0ae0312a567a04455e2a8ffd10587e4c583d9ac0f650a7d2f9f",
                input: inferenceInput,
            }
            const inferenceId = await createInference(inferenceBody);
            return inferenceId
        }
    ));
    return inferenceIds;
}

