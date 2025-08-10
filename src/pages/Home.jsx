import React from "react";
import { assets } from "./../assets/assets";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#FCF4EB] overflow-hidden">
      {/* Pond Background */}
      <img
        src={assets.background}
        alt="Background"
        className="absolute bottom-0 left-0 w-full h-[180px] object-cover z-0"
      />

      {/* Main Content */}
      <div
        className="
    relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 
    min-h-[calc(100vh-180px)] 
    flex flex-col lg:flex-row justify-between items-center lg:items-end
    pt-24 sm:pt-28 md:pt-32 lg:pt-16 xl:pt-0
    gap-6 lg:gap-0
  "
      >
        {/* Left Side - Logo and Text */}
        <div
          className="
    text-center lg:text-left max-w-lg w-full lg:w-auto space-y-6 
    mb-6 lg:mb-0 lg:translate-y-[-120px]
    order-1 lg:order-none
  "
        >
          <img
            src={assets.full_logo}
            alt="Full Logo"
            className="w-64 sm:w-72 md:w-80 lg:w-96 mx-auto lg:mx-0"
          />
          <p className="text-[#91CADB] font-bold text-lg leading-relaxed ">
            Coding bersama Didi akan menjadi petualangan baru yang seru bareng
            kamu!
          </p>
          <Link to="/mulaicoding">
            <button className="bg-[#91CADB] text-white text-lg font-bold px-6 py-2 rounded-xl shadow-md hover:brightness-105 transition-all">
              Mulai Coding
            </button>
          </Link>
        </div>

        {/* Right Side - Duck */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[550px] h-[200px] sm:h-[240px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[440px] order-2 lg:order-none">
          <img
            src={assets.duck}
            alt="Duck"
            className="
    absolute 
    bottom-[-20px] 
    sm:bottom-[-30px] 
    md:bottom-[-40px] 
    lg:bottom-[-50px]
    xl:bottom-[-60px]
    2xl:bottom-[-70px]
    right-0 w-full h-auto z-10
    max-h-[200px] sm:max-h-[240px] md:max-h-[300px] lg:max-h-[350px] xl:max-h-[400px] 2xl:max-h-[440px]
    object-contain
"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
