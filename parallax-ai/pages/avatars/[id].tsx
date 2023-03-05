import { JobRecord } from '@/clients/db';
import Header from '@/components/header'
import { useRouter } from 'next/router';
import useSWR, { Fetcher } from 'swr'

const fetcher: Fetcher<{job: JobRecord}, string> = id => fetch('/api/get-job', {    method: 'POST',
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}, body: JSON.stringify({id: id})}).then(res => res.json())


export default function Dashboard() {
    const router = useRouter()
    const { id } = router.query
  
  const { data, error, isLoading } = useSWR(id, fetcher);
  const job = data?.job;

  return (
    <>
    <Header/>
    <div className="flex flex-col p-10">
    {job ?             
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {job.outputUrls?.map((url) => (
                  <img key={url} className="rounded-xl" src={url} />
            ))}
        </div> : isLoading? "Loading..." :
        "No job found, this is an error, please contact me electronicventureslimited@gmail.com"}
    </div>
    </>
    )
}