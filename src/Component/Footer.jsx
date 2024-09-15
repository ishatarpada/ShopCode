import React from 'react';
import 'remixicon/fonts/remixicon.css';
import logo from '../assets/logoo.svg'


const Footer = () => {
    return (
        <footer className="bg-[#874d16] font-serif text-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Details */}
                    <div>
                        <div className="flex justify-start items-end">
                            <h3 className="text-2xl font-bold mb-4">Shopcode</h3>
                            <img src={logo} alt="" className='h-16 w-12' />
                        </div>
                        <p className="text-md">
                            Shopcode is a leading e-commerce platform providing the best products
                            at unbeatable prices.
                        </p>
                        <p className="text-md mt-2">
                            © 2024 Shopcode, All Rights Reserved.
                        </p>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <i className="ri-facebook-fill text-2xl"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <i className="ri-twitter-fill text-2xl"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="ri-instagram-fill text-2xl"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <i className="ri-linkedin-fill text-2xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Website Links */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Website Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="hover:text-orange-300">About Us</a>
                            </li>
                            <li>
                                <a href="/products" className="hover:text-orange-300">Products</a>
                            </li>
                            <li>
                                <a href="/blog" className="hover:text-orange-300">Blog</a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-orange-300">Contact Us</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <i className="ri-map-pin-line"></i> 1234 Street Name, City, Country
                            </li>
                            <li>
                                <i className="ri-phone-line"></i> +123 456 7890
                            </li>
                            <li>
                                <i className="ri-mail-line"></i> support@shopcode.com
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
