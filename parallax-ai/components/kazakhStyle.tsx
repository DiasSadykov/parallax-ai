export default function KazakhStyle(){
    return (
    <>
        <div className="flex flex-col items-center p-10">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-100 text-center">Featuring this month - Kazakh style&nbsp;🇰🇿</h1>
            <p className="py-6 text-center">We fine-tuned AI to generate the finest avatars in Kazakh style</p>
            <div className="stack mb-16">
                <img src="/landing/kazakh-1.jpg" alt="Image 1" className="rounded" />
                <img src="/landing/kazakh-2.jpg" alt="Image 2" className="rounded" />
                <img src="/landing/kazakh-3.jpg" alt="Image 3" className="rounded" />
            </div>
            <div className="h-36 border-r-2 border-dotted">&nbsp;</div>
        </div>
    </>
    )
}