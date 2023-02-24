export default function Form() {
  return (
      <div className=" flex-col ">
        <div>
          <h1 className="text-8xl font-bold text-slate-100">Create your own <br/>AI Avatars</h1>
          <p className="py-6">Create your own unique avatar with our AI Avatar Making App in oriental style. Choose from a wide range of customizable features inspired by Chinese, Japanese, and Korean cultures. No artistic skills required! Join millions of users and start expressing yourself with an avatar that truly represents you.</p>
        </div>
        <form action="/api/form" encType="multipart/form-data" method="POST" className="w-full flex-col">
            <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">Enter your email:</span>
            </label>
            <input required name="email" type="email" placeholder="example@gmail.com" className="input input-lg input-bordered w-full max-w-md" />
            </div>
            <label className="label">
                <span className="label-text">Choose your photos to train:</span>
            </label>
            <input required name="photos" type="file" multiple className="file-input file-input-bordered file-input-lg w-full max-w-md" />
            <br/>
            <button type="submit" className="btn btn-primary border-lime-700 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Create Avatars (5$)</button>
        </form>
      </div>
    )
}
