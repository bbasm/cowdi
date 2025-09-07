import React from "react";
import { assets } from "./../assets/assets";

const Footer = () => {
  return (
    <div className="w-full overflow-hidden bg-[#FCF4EB]">
      <div className="h-[75px]" />
      <video
        src={assets.bg_better}
        alt="footer"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ objectPosition: "top" }}
      />
    </div>
  );
};

export default Footer;
