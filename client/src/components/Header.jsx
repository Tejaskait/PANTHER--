import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-white">
      <nav className="flex justify-between items-center px-6 lg:px-12 py-4">
        {/* Logo Section */}
        <div className="text-2xl font-semibold tracking-wide">
          <Link to="/" className="hover:text-gray-300 transition-all">
            Panther
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 text-lg">
          <li>
            <Link
              to="/about"
              className="hover:text-gray-300 transition-all uppercase"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className="hover:text-gray-300 transition-all uppercase"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-gray-300 transition-all uppercase"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            to="/signin"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          <button className="text-2xl focus:outline-none hover:text-gray-300 transition-all">
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
