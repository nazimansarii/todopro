import { useContext } from "react";
import {
  FaChevronRight,
  FaUser,
  FaLock,
  FaQuestionCircle,
  FaInfoCircle,
  FaAdjust,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link } from "react-router";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
  const [isDark, setIsDark] = useContext(ThemeContext);
  return (
    <div
      className={`p-4  w-full max-w-4xl mx-auto ${
        isDark ? " text-white " : "text-gray-700 "
      } `}
    >
      <h1 className="text-2xl font-bold py-4 text-center text-inherit">
        Settings
      </h1>

      <div className="border-t border-gray-200 mt-4">
        {/* Account Setting */}
        <Link to={"/account"}>
          <div
            className={`flex rounded-sm ${
              isDark ? "hover:bg-[#313131]" : "hover:bg-gray-100"
            } items-center justify-between py-3 px-4  cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <FaUser className=" text-xl" />
              <span className="font-medium">Account</span>
            </div>
            <FaChevronRight className="" />
          </div>
        </Link>

        {/* Theme Setting */}
        <div
          className={`flex rounded-sm ${
            isDark ? "hover:bg-[#313131]" : "hover:bg-gray-100"
          } items-center justify-between py-3 px-4  cursor-pointer`}
        >
          <div className="flex items-center justify-between gap-3">
            <FaAdjust className="" />

            <span className=" font-medium">Theme</span>
          </div>
          <button
            onClick={() => {
              setIsDark(!isDark);
              localStorage.setItem("isDark", JSON.stringify(!isDark));
            }}
            className={`px-2 py-0.5 border rounded-md cursor-pointer  flex items-center gap-1`}
          >
            {isDark ? <FaMoon /> : <FaSun />}
            {isDark ? "Dark" : "Light"}
          </button>
        </div>

        {/* Help & Support Setting */}
        <Link to={"/help"}>
          <div
            className={`flex rounded-sm ${
              isDark ? "hover:bg-[#313131]" : "hover:bg-gray-100"
            } items-center justify-between py-3 px-4  cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <FaQuestionCircle className=" text-xl" />
              <span className=" font-medium">Help & Support</span>
            </div>
            <FaChevronRight className="" />
          </div>
        </Link>

        {/* Privacy Setting */}
        <Link to={"/privacy"}>
          <div
            className={`flex rounded-sm ${
              isDark ? "hover:bg-[#313131]" : "hover:bg-gray-100"
            } items-center justify-between py-3 px-4  cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <FaLock className=" text-xl" />
              <span className=" font-medium">Privacy</span>
            </div>
            <FaChevronRight className="" />
          </div>
        </Link>

        {/* About Setting */}
        <Link to={"/about"}>
          <div
            className={`flex rounded-sm ${
              isDark ? "hover:bg-[#313131]" : "hover:bg-gray-100"
            } items-center justify-between py-3 px-4  cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <FaInfoCircle className=" text-xl" />
              <span className="font-medium">About</span>
            </div>
            <FaChevronRight className="" />
          </div>
        </Link>
      </div>
    </div>
  );
}
