import React from "react";
import { assets } from "./../assets/assets";
import { useNavigate } from "react-router-dom";

const CodingNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#FCF4EB] sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Logo on the left */}
      <button onClick={() => navigate("/")} className="flex items-center">
        <img
          src={assets.crop_logo}
          className="logo cursor-pointer"
          alt="logo"
        />
      </button>

      {/* Hamburger Icon on the right */}
      <button className="p-2" style={{ color: "#F98D08" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </nav>
  );
};

export default CodingNavbar;
