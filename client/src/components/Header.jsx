import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-transparent text-black">
      <nav className="flex justify-between items-center px-6 lg:px-12 py-4">
        {/* Logo Section */}
        <div className="text-2xl font-semibold tracking-wide">
          <Link to="/" className="hover:text-gray-300 transition-all">
            Panther
          </Link>
        </div>

       

        <div>
        <Link to='/profile'>
            {currentUser ? (
              <h1>Profile</h1>
            ) : (
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="block md:hidden">
          <button className="text-2xl  hover:text-gray-300 transition-all">
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
