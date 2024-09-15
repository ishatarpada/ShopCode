export default function Failed() {
  return (
    <>
      <div className="bg-gray-100 h-screen flex items-center justify-center">

        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path  d="M13 16h-1v-4h-1m0-4h.01M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 text-lg mb-6">We could not process your payment. Please check your details and try again.</p>

          <button className="bg-red-500 text-[15px] text-white py-2 px-6 rounded-full transition duration-300 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300">
            Retry Payment
          </button>

          <p className="mt-4 text-gray-600">
            <a href="/shop" className="underline hover:text-red-500 transition text-[15px]">Back to Dashboard</a>
          </p>
        </div>

      </div>
    </>
  )
}
