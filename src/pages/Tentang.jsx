import React from "react";
import { assets } from "./../assets/assets";
import { Link } from "react-router-dom";

const Tentang = () => {
  return (
    <section className="bg-[#FCF4EB] w-full px-6 sm:px-10 md:px-20 lg:px-32 py-20 flex flex-col md:flex-row items-center justify-center gap-12">
      {/* Left image */}
      <img
        src={assets.tentang_img}
        alt="tentang"
        className="w-full max-w-md md:max-w-lg h-auto"
      />

      {/* Right content */}
      <div className="w-full max-w-xl text-center md:text-left">
        <h2 className="text-[2rem] md:text-[2.5rem] text-[#F98D08] font-bold mb-4">
          Tentang CowDi
        </h2>

        <p className="text-[#91CADB] text-sm md:text-xl font-semibold leading-relaxed mb-6 mx-auto md:mx-0 max-w-prose">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        {/* Button with cursor image */}
        <div className="relative inline-block">
          <Link to="/mulaicoding">
            <button className="bg-[#91CADB] text-white text-lg font-bold px-6 py-3 rounded-xl shadow-md hover:brightness-105 transition-all">
              Mulai Coding
            </button>
          </Link>

          <img
            src={assets.cursor}
            alt="cursor"
            className="absolute -bottom-5 -right-5 w-12 md:w-14 md:-bottom-8 lg:-bottom-10 pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
};

export default Tentang;
