export default function Newsletter() {
  return (
    <>
      <div className="mx-auto my-10 flex  flex-col justify-center items-center container rounded-2xl border px-4 py-4  sm:flex-row">
        <div className="sm:mr-6">
          <img className="h-[13rem] w-[14rem] rounded-2xl object-cover sm:w-56" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYgV6bR8ommomgI1xjC_z0YPU5nCApm_rcTw&s" alt="" />
        </div>
        <div className="py-8 pr-8">
          <p className="text-2xl font-semibold text-gray-800">Subscribe to Newsletter</p>
          <p className="mb-4 text-gray-500 text-xl">Never miss any updates</p>
          <div className="flex">
            <div className="mr-1 w-full">
              <input type="email" className="placeholder:text-gray-400 h-12 w-72 rounded-md bg-gray-200 px-4 font-2xl focus:outline-none focus:ring-1 focus:ring-orange-600" placeholder="Enter your email" />
            </div>
            <button className="shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>

  )
}
