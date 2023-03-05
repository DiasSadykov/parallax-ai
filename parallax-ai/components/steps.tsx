import CreateAvatars from "./createAvatars";

export default function Steps(){
    return (
    <>
        <div className="flex flex-col items-center ">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-100 text-center">Ready to create 100+ new avatars?</h1>
            <p className="py-6 text-center w-3/4">Upload your 10-25 photos in a good lighting from different angles with no other faces except yours. It is preferred for your face to be in the center of the shot. Once you upload your photos you can proceed to checkout.</p>

            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box m-10">
                <input type="checkbox"/> 
                <div className="collapse-title text-md">
                    Check our recommendations before uploading photos
                </div>
                <div className="collapse-content ml-2"> 
                    <ul className="list-disc">
                            <li className="list-item"> Best results are obtained with 10-25 pictures with one face in shot with different angles and poses. Face should be in the center of the frame.</li>
                            <li className="list-item"> If you use iPhone go to Settings &gt; Camera &gt; Format and select Most Compatible to save your photos in JPEG.</li>
                    </ul>
                </div>
            </div>
            <CreateAvatars/>
        </div>
    </>
    )
}