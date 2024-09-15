import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import firebaseAppConfig from "../../util/firebase-config"
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { RiLogoutCircleRLine, RiDashboard3Line, RiMoneyDollarCircleLine, RiSettings3Line, RiMenuUnfold4Fill } from "react-icons/ri";
import { BsPersonSquare } from "react-icons/bs";
import { FaGifts, FaBoxesPacking } from "react-icons/fa6";
import { FaBoxes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import logo from "../../assets/logo.svg";


const auth = getAuth(firebaseAppConfig)

const Layout = ({ children }) => {

    const [session, setSession] = useState(null);
    const [size, setSize] = useState(280);
    const [mobileSize, setMobileSize] = useState(0);
    const [accountMenu, setAccountMenu] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [dropdownMenu, setDropdownMenu] = useState(null);
    const location = useLocation();
    const [open, setOpen] = useState(true);


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user);
            }
            else {
                setSession(null);
            }
        })
    }, [])


    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const menus = [
        { label: 'Dashboard', icon: <RiDashboard3Line className="mr-2" />, link: '/admin-dashboard' },
        {
            label: 'Categories', icon: <FaBoxes className="mr-2" />, link: '/admin-categories', dropdown: true, subMenu: [
                { title: "Add Category", path: "/add-category" },
            ],
        },
        {
            label: 'Products', icon: <FaBoxesPacking className="mr-2" />, link: '/admin-products', dropdown: true,
            subMenu: [
                { title: "Add Products", path: "/add-product" },
            ],
        },
        { label: 'Customers', icon: <BsPersonSquare className="mr-2" />, link: '/admin-customers' },
        { label: 'Orders', icon: <FaGifts className="mr-2" />, link: '/admin-orders' },
        { label: 'Payments', icon: <RiMoneyDollarCircleLine className="mr-2" />, link: '/admin-payments' },
        { label: 'Settings', icon: <RiSettings3Line className="mr-2" />, link: '/admin-settings' }
    ];

    return (
        <>
            {/* Desktop */}
            <div className="md:block hidden font-bolder font-serif">
                <aside
                    className="bg-gray-900 fixed top-0 left-0 h-full overflow-hidden"
                    style={{
                        width: size,
                        transition: '0.3s'
                    }}
                >
                    <div className="m-5 flex justify-center items-end gap-4">
                        <img src={logo} alt="Logo" className="h-12 w-12" />
                        <p className="text-white text-xl">ShopCode</p>
                    </div>
                    <div className="flex flex-col mt-8">
                        <ul>
                            {menus.map((item, index) => (
                                <div key={index} className="relative">
                                    <li
                                        className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-100 text-gray-50 hover:text-gray-900 text-xl items-center gap-x-4 w-auto mt-2`}
                                        onClick={() => item.dropdown && toggleDropdown(index)}
                                    >
                                        <span>{item.icon}</span>
                                        <span className={`ml-2 ${!open && "hidden"}`}>
                                            <Link to={item.link}>{item.label}</Link>
                                        </span>
                                        {item.dropdown && (
                                            <span className={`ml-auto ${!open && "hidden"}`}>
                                                {dropdownOpen === index ? <FaChevronUp /> : <FaChevronDown />}
                                            </span>
                                        )}
                                    </li>
                                    {item.dropdown && dropdownOpen === index && open && (
                                        <ul className="pl-12">
                                            {item.subMenu.map((sub, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className="flex rounded-md py-2 px-1 cursor-pointer hover:bg-gray-200 hover:text-gray-900 text-gray-50 text-lg w-48"
                                                >
                                                    <Link to={sub.path}>{sub.title}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                            <li>
                                <button
                                    onClick={() => signOut(auth)}
                                    className={`flex rounded-md p-2 cursor-pointer text-red-500 text-xl items-center gap-x-6 w-auto mt-2`}>
                                    <RiLogoutCircleRLine />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>
                <section
                    className="bg-gray-100 h-screen"
                    style={{
                        marginLeft: size,
                        transition: '0.3s'
                    }}
                >
                    <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0 z-50">
                        <div className="flex gap-4 items-center">
                            <button
                                className="bg-gray-900 text-white hover:text-gray-900 hover:bg-white hover:border-gray-900 hover:rounded border-4 w-12 h-12 text-center py-1 px-2 border-white rounded font-bold hover:text-2xl"
                                onClick={() => setSize(size === 280 ? 0 : 280)}
                            >
                                <RiMenuUnfold4Fill className="text-2xl text-center" />
                            </button>
                            <h1 className="text-md font-semibold">Shopcode</h1>
                        </div>

                        <div>
                            <button className="relative">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6GkZ7KEyX_UsB7Rpy_LIsF-JiJwqBk0m11nAYM8FWnLaACRFah66TfoLQoR6vE9G0P1c&usqp=CAU"
                                    className="w-10 h-10 rounded-full"
                                    onClick={() => setAccountMenu(!accountMenu)}
                                />
                                {accountMenu && (
                                    <div className="absolute top-12 right-0 rounded bg-gray-50 w-[200px] px-6 py-3 shadow-lg">
                                        <div>
                                            <h1 className="text-lg font-semibold">
                                                {
                                                    session && session.displayName
                                                }
                                            </h1>
                                            <p className="text-gray-500">
                                                {
                                                    session && session.email
                                                }
                                            </p>
                                            <div className="h-px bg-gray-200 my-2" />
                                            <button className="flex justify-center items-center gap-2 w-full text-rose-600 font-bold text-xl"
                                                onClick={() => signOut(auth)}
                                            >
                                                <CiLogout />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </nav>
                    <div className="p-6">
                        {children}
                    </div>
                </section>
            </div>

            {/* Mobile */}
            <div className="md:hidden block">
                <aside
                    className="bg-gray-900 fixed top-0 left-0 h-full z-50 overflow-hidden"
                    style={{
                        width: mobileSize,
                        transition: '0.3s'
                    }}
                >
                    <div className="flex justify-between items-center gap-4">
                        <div className="m-5 flex justify-center items-end gap-4">
                            <img src={logo} alt="Logo" className="h-12 w-12" />
                            <p className="text-white text-xl">ShopCode</p>
                        </div>
                        <button
                            className="text-center mx-4 mt-4 text-white"
                            onClick={() => setMobileSize(mobileSize === 0 ? 280 : 0)}
                        >
                            <RiMenuUnfold4Fill className="text-2xl text-center" />
                        </button>
                    </div>
                    <div className="flex flex-col mt-8">
                        <ul>
                            {menus.map((item, index) => (
                                <div key={index} className="relative">
                                    <li
                                        className="bg-gray-900 px-4 py-3 text-gray-50 text-[18.5px] flex justify-normal items-center gap-3 hover:bg-gray-50 hover:text-white mb-3 cursor-pointer"
                                        style={{
                                            background: location.pathname === item.link ? '#5a5a5a65' : 'transparent',
                                            transition: 'background-color 0.3s, color 0.3s'
                                        }}
                                        onClick={() => {
                                            if (item.dropdown) {
                                                setDropdownMenu(dropdownMenu === item.label ? null : item.label);
                                            }
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </li>
                                    {item.dropdown && dropdownMenu === item.label && (
                                        <div className="absolute left-full top-0 mt-2 w-48 bg-white shadow-lg rounded">
                                            {item.subMenu.map((sub, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    to={sub.path}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                >
                                                    {sub.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </ul>
                    </div>
                </aside>
                <section
                    className="bg-gray-100 h-screen ml-0"
                    style={{
                        marginLeft: mobileSize,
                        transition: '0.3s'
                    }}
                >
                    <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
                        <div className="flex gap-4 items-center">
                            <button
                                className="bg-gray-900 text-white hover:text-gray-900 hover:bg-white hover:border-gray-900 hover:rounded border-4 w-12 h-12 text-center py-1 px-2 border-white rounded font-bold hover:text-2xl"
                                onClick={() => setMobileSize(mobileSize === 280 ? 0 : 280)}
                            >
                                <RiMenuUnfold4Fill className="text-2xl text-center" />
                            </button>
                            <h1 className="text-md font-semibold">Shopcode</h1>
                        </div>

                        <div>
                            <button className="relative">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6GkZ7KEyX_UsB7Rpy_LIsF-JiJwqBk0m11nAYM8FWnLaACRFah66TfoLQoR6vE9G0P1c&usqp=CAU"
                                    className="w-10 h-10 rounded-full"
                                    onClick={() => setAccountMenu(!accountMenu)}
                                />
                                {accountMenu && (
                                    <div className="absolute top-12 right-0 rounded bg-gray-50 w-[200px] px-6 py-3 shadow-lg">
                                        <div>
                                            <h1 className="text-lg font-semibold">Er Saurav</h1>
                                            <p className="text-gray-500">example@gmail.com</p>
                                            <div className="h-px bg-gray-200 my-2" />
                                            <button className="flex justify-center items-center gap-2 w-full text-rose-600 font-bold text-xl">
                                                <CiLogout />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </nav>
                    <div className="p-6">
                        {children}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Layout;
