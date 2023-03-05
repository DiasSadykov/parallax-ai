import AWS from 'aws-sdk';
import JSZip from 'jszip';
import Lottie from 'lottie-react';
import Link from 'next/link';
import { ChangeEventHandler, useState } from 'react';
import { v4 } from 'uuid';
import animationData from '../public/done.json'

AWS.config.update({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-central-1:c3c79653-2848-4d89-9f6c-59f7f766b85c'
    })
  });
  
const s3 = new AWS.S3({
    params: { Bucket: 'parallax-ai' }
});
  
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export default function CreateAvatars(){
    const [progress, setProgress] = useState(0);
    const [trainingDataUrl, setTrainingDataUrl] = useState(null as string | null);

    const onSubmit = async () => {
        if (!trainingDataUrl) {
            alert('Please upload images first');
            return;
        }
        const response = await fetch('/api/checkout-session', {
          method: 'POST',
          redirect: 'follow',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trainingDataUrl }),
        });
        if (!response.ok) {
          alert(response.statusText);
          return;
        }
        await response.json().then((response) => {
            if (!response.url) {
                alert('Something went wrong, please try again later');
                return;
            }
          window.location.href = response.url
        }).catch((err) => {
            alert(err)
        });
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
        const files = event.target.files
        if (!files || files.length === 0) return;
        if (files.length < 5) {
          event.target.value = "";
          alert('Please upload at least 5 images, 10 preferred.');  
          return;
        } 
    
        var zip = new JSZip();
        for (const file of Array.from(files)) {
          const extension = file.name.split('.').pop();
          if(!extension || !ALLOWED_EXTENSIONS.includes(extension.toLowerCase())){
            event.target.value = "";
            alert('File type not supported, please upload only images in jpg, jpeg or png format.');
            return;
          }
          zip.file(v4()+'.'+extension, file);
        }
        zip.generateAsync({type:"blob"})
        .then(async function(content) {
          const params = {
            Bucket: 'parallax-ai',
            Key: v4()+'.zip',
            Body: content,
            ContentType: 'application/zip',
          };
        
          const request = s3.upload(params);
          request.on('httpUploadProgress', function (evt) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
          );
          await request.promise().then((data) => {
            setTrainingDataUrl(data.Location);
            return data.Location;
          }
          );
        });
        setProgress(1);
      }

    return (
    <>
        <div className="flex flex-col p-10 w-full md:w-96">
            { 
                progress > 0 ? progress == 100 ? <>
                <div className='w-full flex flex-row ml-4'>
                <div className='w-24'>
                    <Lottie 
                        animationData={animationData}
                        loop={false}
                        width={100}
                    />
                </div>
                    <p className="text-md font-semibold self-center">Photos Uploaded</p>
                </div>
            </>
            :<progress className="mb-10 progress progress-primary w-full" value={progress} max="100"></progress> : 
            <>
            <p className='text-xs'>By continuing you agree to our <Link href="/terms" className="text-blue-500">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500">Privacy Policy</Link></p>
            <input onChange={handleChange} accept='image/*' required name="photos" type="file" multiple className="file-input file-input-bordered file-input-lg w-full max-w-md"/>
            </>
            }
            <button onClick={onSubmit} className="btn btn-primary border-b-stone-700 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Create Avatars</button>
        </div>
    </>
    )
}