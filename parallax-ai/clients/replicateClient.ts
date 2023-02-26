//function createModel to make post request to replicate.com and return job url

const MODEL_URL_BASE ="https://api.replicate.com/v1/predictions"
const KAZAKH_STYLE_LORA = "https://replicate.delivery/pbxt/E1nA6mK2dJ6TC12fPuF3DypSvUXAvpZl03XSoJCTZbJeyFhQA/tmp4dxcmo_rkazakh40gmailcomzip.safetensors";
const ANIME_CHARACTER_PROMPT = "portrait photo of <1> in style of <2> as anime character,   detailed faces, highres, RAW photo 8k uhd, dslr"
const ANIME_CHARACTER_PROMPT_2 = "portrait photo of <1> as anime character, hayao miyazaki style, detailed faces, highres, RAW photo 8k uhd, dslr"
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
      return await postApiRequest(url, body).then((response) => {return response.id}).catch((error) => {console.log(error); return undefined});
};

export const checkModelCreation = async (id: string | null) => {
    if (!id) {
        return undefined;
    }
    const modelCreationUrl = MODEL_URL_BASE + "/" + id;
    const response = await getApiRequest(modelCreationUrl).then((response) => {return response}).catch((error) => {console.log(error); return undefined})
    return response
};

export const createKazakhStyledInference = async (modelUrl: string | null): Promise<string | null>=> {
    if (!modelUrl) {
        return null;
    }
    const body = {
        version: "300e401c9899d0ae0312a567a04455e2a8ffd10587e4c583d9ac0f650a7d2f9f",
        input: {
            prompt: "portrait photo of <1> in style of <2>, Wes Anderson movie, yurt on a background, detailed faces, highres, RAW photo 8k uhd, dslr",
            negative_prompt: "cropped, multiple people, poorly drawn face, poorly drawn hands, blurry, mutated",
            lora_urls: modelUrl + " | " + KAZAKH_STYLE_LORA,
            lora_scales: "0.5 | 0.5",
            num_outputs: 4,
            guidance_scale: 7.5,
            num_inference_steps: 50,
            scheduler: "K_EULER_ANCESTRAL",
            height: 512,
            width: 512,
        }
    };
    const response = await postApiRequest(MODEL_URL_BASE, body).then((response) => {return response.id}).catch((error) => {console.log(error); return null})
    return response
};
