import CreateAvatars from "./createAvatars";

export default function Steps(){
    return (
    <>
        <div className="flex flex-col items-center ">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-100 text-center">Ready to create 100+ new avatars?</h1>
            <p className="py-6 text-center w-3/4">Upload your 10-25 photos in a good lighting from different angles with no other faces except yours. It is preferred for your face to be in the center of the shot. Once you upload your photos you can proceed to checkout.</p>
            <b className="text-cyan-500">If you use iPhone before taking photos go to Settings &gt; Camera &gt; Format and select Most Compatible to save your photos in JPEG.</b>

            <CreateAvatars/>
        </div>
    </>
    )
}