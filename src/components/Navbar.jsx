import React, { useState } from "react";
import { assets } from "./../assets/assets";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent navbarclass ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={assets.crop_logo} className="logo" alt="logo" />
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          className="no-outline inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-[var(--poporange)] rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`w-full md:block md:w-auto ${
            menuOpen ? "block" : "hidden"
          }`}
          id="navbar-default"
        >
          <ul className="nav-item-spacing font-medium flex flex-col p-4 md:p-0 mt-4 md:mt-0 border-3 border-[var(--poporange)] rounded-lg bg-FCF4EB  md:flex-row md:space-x-8 rtl:space-x-reverse md:border-0 md:bg-transparent">
            <li><a href="#home" className="sub-text py-2 px-3">Home</a></li>
            <li><a href="#tentang" className="sub-text py-2 px-3">Tentang</a></li>
            <li><a href="#faqs" className="sub-text py-2 px-3">FAQs</a></li>
            <li>
              <Link
                to="/mulaicoding"
                className="sub-text code pt-10 pb-2 px-3 md:pt-2 md:pb-2 md:my-0"
              >
                Mulai Coding
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;