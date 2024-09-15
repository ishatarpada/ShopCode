import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoo.svg'
import { IoCloseCircle } from "react-icons/io5";
import firebaseAppConfig from '../util/firebase-config';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore"

const auth = getAuth(firebaseAppConfig)
const db = getFirestore(firebaseAppConfig);

export default function Signup() {

  const [isError, setIsError] = useState(null);
  const [formValue, setFormValue] = useState({
    username: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: ''
  })
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();


  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormValue({
      ...formValue,
      [key]: value
    })
    setIsError(null)
  }

  const signup = async (e) => {
    try {
      e.preventDefault();
      setLoader(true);
      // Firebase expects email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formValue.email, formValue.password);
      updateProfile(auth.currentUser, {
        displayName: formValue.username
      })
      await addDoc(collection(db, "customer"), {
        email: formValue.email,  
        customerName: formValue.username,  
        contactNO: formValue.contactNO,  
        userId: userCredential.user.uid, 
        role : "user",
        createdAt: serverTimestamp()
      })
      navigate('/');
    } catch (error) {
      setIsError(error.message);
    }
    finally {
      setLoader(false);
    }
  };

  const removeError = () => {
    setIsError(null);
  }

  return (
    <>
      <div className="flex min-h-screen w-screen items-center justify-center text-gray-600 bg-gray-50 border">

        <div className="relative">

          <div className="hidden sm:block h-56 w-56 text-orange-300 absolute a-z-10 -left-20 -top-20">
            <svg
              id="patternId"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="a"
                  patternUnits="userSpaceOnUse"
                  width={40}
                  height={40}
                  patternTransform="scale(0.6) rotate(0)"
                >
                  <rect x={0} y={0} width="100%" height="100%" fill="none" />
                  <path
                    d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                    strokeWidth={1}
                    stroke="none"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="800%"
                height="800%"
                transform="translate(0,0)"
                fill="url(#a)"
              />
            </svg>
          </div>

          <div className="hidden sm:block h-28 w-28 text-orange-300 absolute a-z-10 -right-20 -bottom-20">
            <svg
              id="patternId"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="b"
                  patternUnits="userSpaceOnUse"
                  width={40}
                  height={40}
                  patternTransform="scale(0.5) rotate(0)"
                >
                  <rect x={0} y={0} width="100%" height="100%" fill="none" />
                  <path
                    d="M11 6a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5"
                    strokeWidth={1}
                    stroke="none"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width="800%"
                height="800%"
                transform="translate(0,0)"
                fill="url(#b)"
              />
            </svg>
          </div>
          {/* Register */}
          <div className="relative flex flex-col sm:w-[30rem] rounded-lg border-gray-400 bg-white shadow-lg px-4">
            <div className="flex-auto p-6">

              {
                isError &&
                <div className='bg-rose-200 rounded p-5 w-auto mx-auto text-center font-bold text-[18px] text-rose-800 animate__animated animate__pulse flex justify-between items-center'>
                  {isError}
                  <button onClick={removeError}>
                    <IoCloseCircle />
                  </button>
                </div>
              }

              {/* Logo */}
              <div className="mb-10 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden">
                <a
                  href="/"
                  className="flex justify-center cursor-pointer items-center gap-2 text-orange-500 no-underline hover:text-orange-500"
                >
                  <p className="flex-shrink-0 text-7xl font-black lowercase tracking-tight opacity-100">
                    ShopCode
                  </p>
                  <img src={logo} alt="" className="h-12 w-12" />
                </a>
              </div>

              {/* /Logo */}
              <div>
                <p className="text-2xl text-center text-gray-700">
                  Welcome to ShopCode!
                </p>
                <p className="m-0 text-center text-gray-500 text-[16px]">
                  Please login to access your account
                </p>
              </div>

              <hr className="w-72 mx-auto border-1 border-orange-500"></hr>

              <form className="my-4" onSubmit={signup}>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="mb-2 inline-block text-xs font-semibold uppercase text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-gray-100 py-2 px-3 text-sm outline-none focus:border-orange-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2 inline-block text-xs font-semibold uppercase text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-gray-100 py-2 px-3 text-sm outline-none focus:border-orange-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="Number"
                    className="mb-2 inline-block text-xs font-semibold uppercase text-gray-700"
                  >
                    Contact No
                  </label>
                  <input
                    type="number"
                    className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-gray-100 py-2 px-3 text-sm outline-none focus:border-orange-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    id="Number"
                    name="contactNO"
                    onChange={handleChange}
                    placeholder="Enter your Number"
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <label
                      className="mb-2 inline-block text-xs font-semibold uppercase text-gray-700"
                      htmlFor="password"
                    >
                      Password
                    </label>
                  </div>
                  <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                    className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-gray-100 py-2 px-3 text-sm outline-none focus:border-orange-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    name="password"
                    placeholder="············"
                  />

                </div>
                <div className="mb-4">
                  <div className="flex justify-between">
                    <label
                      className="mb-2 inline-block text-xs font-semibold uppercase text-gray-700"
                      htmlFor="password"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                    className="block w-full cursor-text appearance-none rounded-md border border-gray-400 bg-gray-100 py-2 px-3 text-sm outline-none focus:border-orange-500 focus:bg-white focus:text-gray-600 focus:shadow"
                    name="confirmPassword"
                    placeholder="············"
                  />

                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        className="mr-2 h-5 w-5 appearance-none rounded border border-gray-300 bg-contain bg-no-repeat align-top text-black shadow checked:bg-orange-500 focus:border-orange-500 focus:shadow"
                        type="checkbox"
                        id="remember-me"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3e%3cpath fill=\'none\' stroke=\'%23fff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M6 10l3 3l6-6\'/%3e%3c/svg%3e")'
                        }}
                        defaultChecked
                      />
                      <label className="text-sm" htmlFor="remember-me">
                        Remember Me
                      </label>
                    </div>
                    <a
                      href="/"
                      className="cursor-pointer  text-orange-500 px-3 py-2 no-underline hover:text-orange-500"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <div className="mb-4">
                  {
                    loader ?
                      <h1 className="text-2xl font-semibold text-gray-600 text-center">
                        <i className="fa fa-spinner fa-spin text-blue-500"></i>
                      </h1>
                      :
                      <button
                        className="grid w-full cursor-pointer rounded-md border border-orange-500 bg-orange-500 py-2 px-5 text-center text-sm text-white shadow hover:border-orange-600 hover:bg-orange-600 hover:text-white focus:border-orange-600 focus:bg-orange-600 focus:text-white focus:shadow-none"
                        type="submit"
                      >
                        Sign-up
                      </button>
                  }
                </div>

              </form>
              <p className="mb-4 text-[16px] text-center">
                already have account?
                <a
                  href="/login"
                  className="cursor-pointer text-orange-500 underline hover:text-orange-500"
                >
                  {" "}
                  login account{" "}
                </a>
              </p>
            </div>
          </div>
          {/* /Register */}
        </div>
      </div>
    </>
  )
}
