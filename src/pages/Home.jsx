// // export default Home;
// import React from "react";
// import { assets } from "./../assets/assets";

// const Home = () => {
//   return (
//     <section className="relative w-full min-h-screen bg-[#FCF4EB] overflow-hidden">
//       {/* Pond Background */}
//       <img
//         src={assets.background}
//         alt="Background"
//         className="absolute bottom-0 left-0 w-full h-[180px] object-cover z-0"
//       />

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-32 flex flex-col md:flex-row justify-between items-end min-h-[calc(100vh-180px)]">
//         {/* Left Side - Logo and Text */}
//         <div className="text-center md:text-left max-w-lg md:ml-4 lg:ml-8 xl:ml-16 space-y-6 mb-12">
//           <img
//             src={assets.full_logo}
//             alt="Full Logo"
//             className="w-64 sm:w-72 md:w-80 lg:w-96 mx-auto md:mx-0"
//           />
//           <p className="text-[#91CADB] font-bold text-lg leading-relaxed">
//             Coding bersama Didi akan menjadi petualangan baru yang seru bareng kamu!
//           </p>
//           <button className="bg-[#91CADB] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition-all">
//             Mulai Coding
//           </button>
//         </div>

//         {/* Right Side - Duck */}
//         <div className="relative w-full max-w-[350px] sm:max-w-[390px] md:max-w-[430px] lg:max-w-[450px] h-[230px] sm:h-[280px] md:h-[350px] lg:h-[380px]">
//           <img
//             src={assets.duck}
//             alt="Duck"
//             className="absolute bottom-[-50px] right-0 w-full h-auto z-10"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

import React from "react";
import { assets } from "./../assets/assets";

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
  //       className="
  //   relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 
  //   min-h-[calc(100vh-180px)] 
  //   flex flex-col md:flex-row justify-between items-center md:items-end
  //   pt-24 sm:pt-28 md:pt-32 xl:pt-0
  // "
  className="
    relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 
    min-h-[calc(100vh-180px)] 
    flex flex-row justify-between items-center md:items-end
    pt-24 sm:pt-28 md:pt-32 xl:pt-0
    portrait:flex-col
  "
      >
        {/* Left Side - Logo and Text */}
        <div
          className="
    text-center xl:text-left max-w-lg w-full xl:w-auto space-y-6 
    mb-12 xl:mb-0 xl:translate-y-[-120px]
    portrait:items-center portrait:mx-auto
  "
        >
          <img
            src={assets.full_logo}
            alt="Full Logo"
            className="w-64 sm:w-72 md:w-80 lg:w-96 mx-auto xl:mx-0"
          />
          <p className="text-[#91CADB] font-bold text-lg leading-relaxed">
            Coding bersama Didi akan menjadi petualangan baru yang seru bareng
            kamu!
          </p>
          <button className="bg-[#91CADB] text-white text-lg font-bold px-6 py-2 rounded-xl shadow-md hover:brightness-105 transition-all">
            Mulai Coding
          </button>
        </div>

        {/* Right Side - Duck */}
        <div className="relative w-full max-w-[350px] sm:max-w-[390px] md:max-w-[430px] lg:max-w-[450px] h-[230px] sm:h-[280px] md:h-[350px] lg:h-[380px]">
          <img
            src={assets.duck}
            alt="Duck"
            className="
    absolute 
    bottom-[-50px] 
    md:bottom-[-30px] 
    xl:bottom-[-50px] 
    right-0 w-full h-auto z-10
"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
