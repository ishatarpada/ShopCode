import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Slider from './Slider';
import Box from './Box';
import Newsletter from './Newsletter';
import Footer from './Footer';
import ArticleCard from './ArticleCard';
import logo from '../assets/logoo.svg';
import 'animate.css';

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Set a timer for 3 seconds, then hide the splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds

    // Clear the timer if the component unmounts before 3 seconds
    return () => clearTimeout(timer);
  }, []);

  // Splash screen part
  if (showSplash) {
    return (
      <div className="w-full h-full fixed top-0">
        <div className="flex justify-center items-center h-full w-full">
          <p className="text-7xl text-orange-500 font-bold animate__animated animate__backInDown animate__slower">ShopCode</p>
          <img src={logo} alt="Logo" className="h-24 w-24 animate__animated animate__bounceInUp animate__slower" />
        </div>
      </div>
    );
  }

  // Main content part
  return (
    <>
      <div>
        <Navbar />
        <Slider />
        <Box />
        <ArticleCard />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
};

export default Home;
