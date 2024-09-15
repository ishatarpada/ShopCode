import { useEffect, useState } from 'react'
import firebaseAppConfig from '../util/firebase-config'
import { onAuthStateChanged, getAuth, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/avtar.svg"
import Swal from 'sweetalert2'

const auth = getAuth(firebaseAppConfig)
const storage = getStorage()

const ProfileInfo = () => {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [session, setSession] = useState(null) // State to manage user session
  const [formValue, setFormValue] = useState({
    fullName: '',
    email: ''
  })

  useEffect(() => {
    // Check if the user is authenticated on component load
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user)
      } else {
        setSession(false)
        navigate('/login') // Navigate to login if the user is not authenticated
      }
    })
  }, [])

  useEffect(() => {
    // Update the form values when session data is available
    if (session) {
      setFormValue({
        ...formValue,
        fullName: session.displayName || '', // Check if displayName exists
        mobile: session.phoneNumber || '' // Check if phoneNumber exists
      })
    }
  }, [session])

  const setProfilePicture = async (e) => {
    const file = e.target.files[0]
    if (!file) return // Early return if no file is selected

    const filenameArray = file.name.split(".")
    const ext = filenameArray[filenameArray.length - 1]
    const filename = Date.now() + '.' + ext
    const path = `pictures/${filename}`
    const bucket = ref(storage, path)

    setUploading(true) // Start upload
    try {
      const snapshot = await uploadBytes(bucket, file)
      const url = await getDownloadURL(snapshot.ref)
      await updateProfile(auth.currentUser, {
        photoURL: url // Update the user's photo URL
      })
      setSession({
        ...session,
        photoURL: url // Update session state to reflect new profile picture
      })
      setUploading(false)
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      setUploading(false)
    }
  }

  const handleFormValue = (e) => {
    const { name, value } = e.target // Destructure name and value from input event
    setFormValue({
      ...formValue,
      [name]: value // Dynamically update form value based on input field
    })
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(auth.currentUser, {
        displayName: formValue.fullName, // Use correct key
        phoneNumber: formValue.mobile // phoneNumber is not directly updatable in Firebase, consider alternative
      })

      Swal.fire({
        title: "Profile Updated",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      })
      console.log("Profile Updated:", formValue)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (session === null)
    return (
      <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
        <span className="relative flex h-6 w-6">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
        </span>
      </div>
    )

  return (
    <>
      {/* Profile Update Section */}
      <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24 font-serif bg-gradient-to-tl from-white to-gray-500">
        <div className="mx-auto w-full max-w-lg">
          <h1 className="relative text-2xl font-medium text-white sm:text-3xl">
            <i className="ri-profile-fill mx-3"></i>
            Profile
            <span className="mt-2 block h-1 bg-orange-600 sm:w-20" />
          </h1>

          {/* Profile Picture Upload */}
          <div className='w-24 h-24 mx-auto relative mb-6'>
            {
              uploading ?
                <h1 className="text-7xl font-semibold text-white text-center">
                  <i className="fa fa-spinner fa-spin text-blue-500"></i>
                </h1>
                :
                <div>
                  <img src={session.photoURL || logo} className='rounded-full w-24 h-24 border shadow shadow-orange-500' />
                  <input type="file" accept="image/*" className='opacity-0 absolute top-0 left-0 w-full h-full'
                    onChange={setProfilePicture} />
                </div>
            }
          </div>

          <form onSubmit={saveProfile} className="mt-10 flex flex-col space-y-4">
            <div>
              <label className="text-xl font-medium text-white ">
                Full Name
              </label>
              <input type="text" onChange={handleFormValue} required name="fullName" value={formValue.fullName}
                className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="text-xl font-medium text-white ">
                Email
              </label>
              <input type="email" required value={session.email} disabled
                // Disable email field to prevent             changes
                className="block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 pr-10 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" />
              <img src="/images/uQUFIfCYVYcLK0qVJF5Yw.png" alt="" className="absolute bottom-3 right-3 max-h-4" />
            </div>
            <button type="submit"
              className="mt-4 inline-flex w-full items-center justify-center rounded bg-orange-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-orange-500 sm:text-lg">
              <i className="ri-save-line mr-2"></i>
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
export default ProfileInfo;