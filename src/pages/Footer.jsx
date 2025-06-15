import React from "react";
import { assets } from "./../assets/assets";

const Footer = () => {
  return (
    <div className="w-full overflow-hidden bg-[#FCF4EB]">
      <div className="h-[70px]" /> {/* Spacer to push image down */}
      <img
        src={assets.footer_img}
        alt="footer"
        className="w-full h-[200px] object-cover opacity-50"
        style={{ objectPosition: "top" }}
      />
    </div>
  );
};

export default Footer;
