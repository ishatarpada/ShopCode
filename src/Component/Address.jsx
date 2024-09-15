import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, addDoc, collection, where, query, getDocs, updateDoc, doc } from "firebase/firestore";
import firebaseAppConfig from '../util/firebase-config';

const db = getFirestore(firebaseAppConfig);
const auth = getAuth(firebaseAppConfig)

export default function Address() {

  const [isAddress, setIsAddress] = useState();
  const [session, setSession] = useState();
  const [id, setId] = useState(null);
  const [isUpdated, setisUpdated] = useState(false);
  const [formValue, setFormValue] = useState({
    contactNo: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    userId: ''
  });

  const navigate = useNavigate();


  // Check if the user is authenticated
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(false);
        navigate('/login');
      }
    });
  }, [auth, navigate]);


  // Update formValue when session is set
  useEffect(() => {
    const req = async () => {
      if (session) {
        setFormValue(prevValue => ({
          ...prevValue,
          userId: session.uid
        }));

        // fetching Address
        const address = query(collection(db, "addresses"), where("userId", "==", session.uid));
        const snapshot = await getDocs(address);
        setIsAddress(!snapshot.empty);
        snapshot.forEach(doc => {
          setId(doc.id);
          setFormValue({
            ...formValue,
            ...doc.data()
          })
        });
      }
    }
    req();
  }, [session, isUpdated]);


  // Handle form input changes
  const handleFormValue = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };


  // Handle form submission
  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      // Attempt to save the address in Firestore
      const data = await addDoc(collection(db, "addresses"), formValue);
      setIsAddress(true);
      setIsAddress(!isUpdated);
      console.log('Document written with ID: ', data.id);

      Swal.fire({
        title: "Address Saved",
        icon: "success"
      });

    } catch (error) {
      console.log('Error adding document: ', error);

      // Show error message if the save fails
      Swal.fire({
        title: "Error",
        text: `There was an issue saving the address. Please try again.`,
        icon: "error"
      });
    }
  };


  const updateAddress = async (e) => {
    try {
      e.preventDefault();
      const ref = doc(db, "addresses", id);
      await updateDoc(ref, formValue);
      Swal.fire({
        title: "Success",
        text: `Address Updated`,
        icon: "Success"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `${error.message}`,
        icon: "error"
      });
    }
  }



  return (
    <>
      <div className="relative col-span-full flex flex-col py-2 pl-8 pr-4 sm:py-12 lg:col-span-4">
        <div>
          <img
            src="https://images.pexels.com/photos/28120520/pexels-photo-28120520/free-photo-of-a-sign-with-a-number-on-it-and-a-bunch-of-stickers-on-it.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-orange-600 to-orange-400 opacity-95" />
        </div>
        <div className="relative">
          <div className='bg-transparent mx-auto md:my-16 rounded-md md:w-7/12'>
            <div className='flex gap-3'>
              <i className="ri-truck-fill text-5xl text-white"></i>
              <h1 className="text-4xl font-semibold text-white">Delivery Address</h1>
            </div>

            <hr className='my-6' />

            <form className='grid grid-cols-2 gap-6' onSubmit={isAddress ? updateAddress : saveAddress}>
              <div className='flex flex-col gap-2 col-span-2'>
                <label className="text-xl font-medium text-white ">
                  Mobile Number
                </label>
                <input type="number" onChange={handleFormValue} required name="contactNo"  // Changed to text to allow formatting 
                  value={formValue.contactNo}
                  className="block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 pr-10 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className='flex flex-col gap-2 col-span-2'>
                <label className='text-lg font-medium text-white'>Area/Street/Village</label>
                <input onChange={handleFormValue} required name="address" type="text"
                  className='p-2 rounded border border-gray-300' value={formValue.address} />
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-lg font-medium text-white'>City</label>
                <input onChange={handleFormValue} required name="city" type="text"
                  className='p-2 rounded border border-gray-300' value={formValue.city} />
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-lg font-medium text-white'>State</label>
                <input onChange={handleFormValue} required name="state" type="text"
                  className='p-2 rounded border border-gray-300' value={formValue.state} />
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-lg font-medium text-white'>Country</label>
                <input onChange={handleFormValue} required name="country" type="text"
                  className='p-2 rounded border border-gray-300' value={formValue.country} />
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-lg font-medium text-white'>PinCode</label>
                <input onChange={handleFormValue} required name="pinCode" type="number"
                  className='p-2 rounded border border-gray-300' value={formValue.pinCode} />
              </div>

              {
                isAddress ?
                  <button type="submit" className='px-4 py-2 bg-gray-600 text-white rounded w-fit hover:bg-gray-900'>
                    <i className="ri-save-line mr-2"></i>
                    Update
                  </button>

                  :
                  <button type="submit" className='px-4 py-2 bg-gray-600 text-white rounded w-fit hover:bg-gray-900'>
                    <i className="ri-save-line mr-2"></i>
                    Save
                  </button>
              }
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
