import { JobRecord, JobState } from '@/clients/db';
import Footer from '@/components/footer'
import Header from '@/components/header'
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import useSWR, { Fetcher } from 'swr'
import animationData from '../public/loading.json'

const fetcher: Fetcher<{userJobs: JobRecord[]}, string> = url => fetch(url).then(res => res.json())

const mapStateToString = (state: JobState) => {
  switch (state) {
    case JobState.COMPLETED:
      return "Completed";
    case JobState.INFERENCING:
      return "Creating Avatars";
    case JobState.MODEL_CREATED:
      return "Model Created";
    case JobState.MODEL_CREATING:
      return "Model Creating";
    case JobState.PENDING:
      return "Pending";
    default:
      return "Unknown";
  }
}
export default function Dashboard() {
  const { data, error, isLoading } = useSWR('/api/getUserJobs', fetcher, { refreshInterval: 10000 });
  const [job, selectJob] = useState(undefined as JobRecord | undefined);
  useEffect(()=>{
    selectJob(data?.userJobs?.[0])
  }, [data])

  return (
    <>
    <Header/>

    <div className="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-10">
        {!job ? null :
        <>
          {
            job.jobState !== JobState.COMPLETED ?
            <div className="self-center ">
              <ul className="steps steps-vertical lg:steps-horizontal">
                <li className={"step"+([JobState.COMPLETED, JobState.INFERENCING, JobState.MODEL_CREATED, JobState.MODEL_CREATING, JobState.PENDING].indexOf(job?.jobState)!=-1 ? " step-primary": "") }><b>Uploading Photos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></li>
                <li className={"step"+([JobState.COMPLETED, JobState.INFERENCING, JobState.MODEL_CREATED, JobState.MODEL_CREATING].indexOf(job?.jobState)!=-1 ? " step-primary": "") }><b>Creating Model</b></li>
                <li className={"step"+([JobState.COMPLETED, JobState.INFERENCING].indexOf(job?.jobState)!=-1 ? " step-primary": "") }><b>Creating Avatars</b></li>
                <li className={"step"+([JobState.COMPLETED].indexOf(job?.jobState)!=-1 ? " step-primary": "") }><b>Finalizing</b></li>
              </ul>
              <Lottie 
                animationData={animationData}
                width={100}
              />
            </div> :
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {job.outputUrls?.map((url) => (
                  <img key={url} className="rounded-xl" src={url} />
            ))}
            </div>
          }
        </>
        }
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 bg-base-200 text-base-content">
          {data?.userJobs?.map((job) => (
            <li key={job.id} className="font-bold">
              <a onClick={() => selectJob(job)} href="#">{new Date(job.timestamp *1000).toLocaleDateString("en-gb") + ": " + mapStateToString(job.jobState)}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
    )
}
