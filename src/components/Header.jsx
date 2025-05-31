import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import userIcon from "../assets/user.jpg";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const [isDark] = useContext(ThemeContext)
  const { user } = useAuth();

  return (
    <header className={`px-5 ${isDark ? 'bg-[#1B1B1B]' : 'bg-gray-100'} flex flex-wrap justify-between py-2 gap-3  items-center  sticky top-0  z-20`}>
      <div className={`flex   ${isDark ? 'bg-[#313131]' : 'bg-gray-100'} items-center  gap-3 shadow-sm   px-4 py-2 rounded-md  w-full max-w-md `}>
        <FaSearch className="text-base " />

        <input
          type="search"
          placeholder="Search"
          className="flex-1   outline-none text-sm  placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <h2 className="hidden sm:block text-xl font-semibold text-center">
          {user ? (user.displayName || user.email) : 'Guest'}
        </h2>
        <div className="hidden lg:block">
        <div className="w-20 mt-1 flex justify-center items-center rounded-full overflow-hidden">
          <img src={userIcon} alt="" />
        </div>
        </div>
      </div>
    </header>
  );
};
