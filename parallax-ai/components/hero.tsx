import Link from "next/link";

export default function Hero() {
  return (
      <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <img src="/landing/landing.jpg" className="max-w-xs md:max-w-sm rounded-lg shadow-2xl" />
        <div className=" flex-col ">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold text-slate-100">Create your own <br/>AI Avatars</h1>
            <p className="py-6">Create your own unique avatar with our AI Avatar Making App in oriental style. Choose from a wide range of customizable features inspired by Chinese, Japanese, and Korean cultures. No artistic skills required! Join millions of users and start expressing yourself with an avatar that truly represents you.</p>
          </div>
            <>
            <Link href={"#demo"} className="btn btn-primary border-b-stone-700 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 m-auto">Get Started</Link>
            </>
        </div>      
      </div>
    </div>
    )
}
