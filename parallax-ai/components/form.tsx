import AWS from 'aws-sdk';
import JSZip from 'jszip';
import Lottie from 'lottie-react';
import { signIn, useSession } from 'next-auth/react';
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

export default function Form() {
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState(0);
  const [trainingDataUrl, setTrainingDataUrl] = useState(null as string | null);

  const onSubmit = async () => {
    const response = await fetch('/api/checkout-session', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ trainingDataUrl }),
    });
    await response.json().then((response) => {
      window.location.href = response.url
    }).catch((err) => {
      console.log(err)
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
        Key: session?.user?.email+'.zip',
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
  } 


  return (
      <div className=" flex-col ">
        <div>
          <h1 className="text-6xl md:text-8xl font-bold text-slate-100">Create your own <br/>AI Avatars</h1>
          <p className="py-6">Create your own unique avatar with our AI Avatar Making App in oriental style. Choose from a wide range of customizable features inspired by Chinese, Japanese, and Korean cultures. No artistic skills required! Join millions of users and start expressing yourself with an avatar that truly represents you.</p>
        </div>
        {status === "authenticated" ? 
          progress > 0 ? progress == 100 ? <>
            <div className='w-full flex flex-row'>
            <div className='w-24'>
              <Lottie 
                animationData={animationData}
                loop={false}
                width={100}
              />
            </div>
            <p className="text-md font-semibold self-center">Photos Uploaded</p>
          </div>
          <button onClick={onSubmit} className="btn btn-primary border-b-stone-700 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Create Avatars [FREE FOR BETA TESTERS]</button>
          </>
          :<progress className="progress progress-primary w-56" value={progress} max="100"></progress> :
      
          <form encType="multipart/form-data" className="w-full flex-col">
              <label className="label">
                  <span className="label-text">Choose your photos (look for recommendations in FAQ):</span>
              </label>
              <input onChange={handleChange} accept='image/*' required name="photos" type="file" multiple className="file-input file-input-bordered file-input-lg w-full max-w-md"/>
              <br/>
              <p className='text-xs'>By continuing you agree to our <Link href="/terms" className="text-blue-500">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500">Privacy Policy</Link></p>
              <button type="submit" className="btn btn-primary border-b-stone-700 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Create Avatars</button>
          </form> : 
          <>
          <button className="btn btn-primary border-b-stone-700 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" onClick={() => signIn("google")}>Get Started</button>
          </>
        }
      </div>
    )
}
