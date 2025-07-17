import React from "react";
import { assets } from "./../assets/assets";

const Footer = () => {
  return (
    <div className="w-full overflow-hidden bg-[#FCF4EB]">
      <div className="h-[75px]" />
      <img
        src={assets.bg_better}
        alt="footer"
        className="w-full h-full object-cover"
        style={{ objectPosition: "top" }}
      />
    </div>
  );
};

export default Footer;
