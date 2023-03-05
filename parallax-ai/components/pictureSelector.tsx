import { useState } from "react";

export default function PictureSelector(){
    const [photo, setPhoto] = useState("billie");

    return (
    <>
        <div id="demo" className="flex flex-col items-center mt-20 p-10">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-100 text-center">check out results before trying&nbsp;👇</h1>
            <p className="py-6">For best results we recommend to follow FAQ for uploading your photos, best results are obtained with 10-25 pictures.</p>
            <div className="w-96 flex flex-row justify-between p-6 m-4">
                <div onClick={()=>{setPhoto("billie")}} className={"w-24 h-24 rounded-xl overflow-hidden " + (photo == "billie" ? "border-4 border-green-500" : "")}>
                    <img src="/landing/billie.jpg" />
                </div>
                <div onClick={()=>{setPhoto("brad")}} className={"w-24 h-24 rounded-xl overflow-hidden " +(photo == "brad" ? "border-4 border-green-500" : "")}>
                    <img src="/landing/brad.jpg" />
                </div>
                <div onClick={()=>{setPhoto("andrew")}} className={"w-24 h-24 rounded-xl overflow-hidden " + (photo == "andrew" ? "border-4 border-green-500" : "")}>
                    <img src="/landing/andrew.jpg" />
                </div>
            </div>
            <div className="carousel rounded-box h-96">
            <div className="carousel-item">
                <img src={`/landing/${photo}/1.jpg`}/>
            </div> 
            <div className="carousel-item">
                <img src={`/landing/${photo}/2.jpg`}/>
            </div> 
            <div className="carousel-item">
                <img src={`/landing/${photo}/3.jpg`}/>
            </div> 
            <div className="carousel-item">
                <img src={`/landing/${photo}/4.jpg`}/>
            </div> 
            </div>
            <p className="py-6 text-center font-bold">Swipe to see more 👉</p>

        </div>
    </>
    )
}