import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoo.svg';
import '../Style/style.css'
import { IoPersonCircle } from "react-icons/io5";
import { FaCartArrowDown } from "react-icons/fa6";
import { FaUserAlt, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import firebaseAppConfig from '../util/firebase-config'
import { getFirestore, query, collection, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const auth = getAuth(firebaseAppConfig);
const db = getFirestore(firebaseAppConfig);

const Demo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [session, setSession] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user);
            } else {
                setSession(null);
            }
        });
        return () => unsubscribe(); // Clean up subscription on unmount
    }, []);

    useEffect(() => {
        if (session) {
            const fetchCartCount = async () => {
                const col = collection(db, "carts");
                const cartQuery = query(col, where("userId", "==", session.uid));
                const snapshot = await getDocs(cartQuery);
                setCartCount(snapshot.size);
            };
            fetchCartCount();
        }
    }, [session]);

    const openProfile = () => {
        setProfileMenuOpen(!profileMenuOpen);
    }
  return (
    <>
      <div className="navbar w-screen sticky z-20 top-2 overflow-hidden">
        <nav className="bg-white font-serif relative">
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {!isOpen ? (
                    <i className="ri-menu-line text-2xl"></i>
                  ) : (
                    <i className="ri-close-line text-2xl"></i>
                  )}
                </button>
              </div>
              <div className="flex-1 flex items-center justify-evenly">
                <div className="flex-shrink-0 flex justify-center items-center gap-2">
                  <img src={logo} alt="Logo" className="h-12" />
                  <h1 className="text-gray-900 font-bold text-2xl">Shopcode</h1>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <Link
                      to="/"
                      className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 font-Medium px-3 py-2 rounded-md text-[16px]"
                    >
                      Home
                    </Link>
                    <Link
                      to="/shop"
                      className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 font-Medium px-3 py-2 rounded-md text-[16px]"
                    >
                      Shop
                    </Link>
                    <Link
                      to="/categories"
                      className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 font-Medium px-3 py-2 rounded-md text-[16px]"
                    >
                      Categories
                    </Link>
                    <Link
                      to="/about"
                      className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 font-Medium px-3 py-2 rounded-md text-[16px]"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/blog"
                      className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 font-Medium px-3 py-2 rounded-md text-[16px]"
                    >
                      Blog
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center gap-3">
                <ul className="flex space-x-4 text-gray-800 text-3xl justify-between items-center">
                  <li className="flex items-center justify-center">
                    <Link to="/cart" className="hover:text-gray-500 relative inline-block">
                      <FaCartArrowDown />
                      {cartCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-[2px] text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="flex items-center justify-center">
                    {
                      session ?
                        <Link to="/login" className="hover:text-gray-500">
                          <IoPersonCircle />
                        </Link> :
                        <Link to="/sign-up" className="hover:text-gray-500">
                          <IoPersonCircle />
                        </Link>
                    }
                  </li>
                </ul>

                {
                  session &&
                  <div className="hidden sm:block relative">
                    <button onClick={openProfile} className="relative">
                      <img
                        src={
                          session.photoURL ? session.photoURL : { logo }
                        }
                        data-tooltip-target="tooltip-bottom"
                        data-tooltip-placement="bottom" type="button"
                        className="w-10 h-10 rounded-full border-2 border-orange-500"
                        alt="User Avatar"
                      />
                      <div id="tooltip-bottom" role="tooltip" className="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        {session.displayName}
                        <div className="tooltip-arrow" data-popper-arrow></div>
                      </div>
                    </button>
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-red-500 rounded-lg shadow-lg py-5 z-50">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 rounded text-gray-800 font-Medium hover:bg-orange-50"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaUserAlt className="mr-2" /> Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 rounded text-gray-800 font-Medium hover:bg-orange-50"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaInfoCircle className="mr-2" /> Orders
                        </Link>
                        <Link
                          to="/help"
                          className="flex items-center px-4 py-2 rounded text-gray-800 font-Medium hover:bg-orange-50"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaQuestionCircle className="mr-2" /> Help/Support
                        </Link>
                        <Link
                          to="/faqs"
                          className="flex items-center px-4 py-2 rounded text-gray-800 font-Medium hover:bg-orange-50"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <FaQuestionCircle className="mr-2" /> FAQs
                        </Link>
                        <hr />
                        <button
                          onClick={() => {
                            signOut(auth)
                          }}
                          className="block px-4 py-2 mt-2 rounded font-Medium hover:bg-rose-100 text-rose-600 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`fixed inset-y-0 left-0 bg-orange-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:hidden`}>
            <div className="px-2 pt-2 pb-3 pe-24 space-y-1 flex flex-col h-full">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-4 text-gray-900 hover:text-orange-500 "
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
              <div className="flex justify-start items-end">
                <h3 className="text-2xl font-bold mb-4">Shopcode</h3>
                <img src={logo} alt="" className='h-16 w-12' />
              </div>
              <Link
                to="/"
                className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/categories"
                className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/blog"
                className="text-gray-900 hover:bg-orange-50 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="my-3">
        <Swiper
          pagination={true}
          navigation={true}
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          className='mx-auto rounded'
          style={{ height: '400px', width: '90%' }}
        >
          <SwiperSlide>
            <img src={banner2} alt="Banner 2" className='rounded' style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={banner1} alt="Banner 1" className='rounded' style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
          </SwiperSlide>
          <SwiperSlide>
            <img src={banner3} alt="Banner 3" className='rounded' style={{ height: '100%', width: '100%', objectFit: 'fill' }} />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}

export default Demo