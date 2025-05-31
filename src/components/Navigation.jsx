import React, { useContext } from "react";
import { NavLink } from "react-router"; // Use NavLink instead of Link
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaCog,
  FaCloudSun,
  FaRegStickyNote,
  FaChartLine,
  FaUserCircle,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export const Navigation = () => {
  const [isDark] = useContext(ThemeContext);
  return (
    <>
      <nav
        className={` ${
          isDark ? "sm:bg-[#313131]" : "sm:bg-[#1B1B1B]"
        } sm:min-h-screen w-full  sm:w-max sm:px-8 text-white font-bold fixed bottom-0 left-0 z-50  sm:sticky   `}
      >
        <ul
          className={`flex w-full  sm:justify-center sm:items-center sm:flex-col sm:gap-4 mt-10  shadow-2xl sm:shadow-none shadow-yellow-900     ${
            isDark ? "sm:bg-[#313131] bg-[#1B1B1B] " : "bg-[#1B1B1B]"
          } `}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center  justify-evenly hover:shadow-sm transition ease-linear duration-150 shadow-orange-300 rounded-sm sm:justify-normal    gap-2 my-2 w-full ${
                isActive
                  ? " text-orange-300  sm:shadow-sm sm:px-4 sm:py-2 sm:rounded-sm"
                  : "sm:px-4 py-2"
              }`
            }
          >
            {() => (
              <>
                <FaHome className="text-[15px] text-inherit" />
                <span className="hidden sm:block">Home</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `flex items-center  justify-evenly hover:shadow-sm transition ease-linear duration-150 shadow-orange-300 rounded-sm sm:justify-normal gap-2 my-2 w-full ${
                isActive
                  ? " text-orange-300  sm:shadow-sm sm:px-4 sm:py-2 sm:rounded-sm"
                  : "sm:px-4 py-2"
              }`
            }
          >
            {() => (
              <>
                <FaTasks className="text-[15px] text-inherit" />
                <span className="hidden sm:block">Tasks</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `flex items-center  justify-evenly hover:shadow-sm transition ease-linear duration-150 shadow-orange-300 rounded-sm sm:justify-normal gap-2 my-2 w-full ${
                isActive
                  ? " text-orange-300  sm:shadow-sm sm:px-4 sm:py-2 sm:rounded-sm"
                  : "sm:px-4 py-2"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FaRegStickyNote className={isActive ? "text-[15px]" : ""} />
                <span className="hidden sm:block">Notes</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/weather"
            className={({ isActive }) =>
              `flex items-center  justify-evenly hover:shadow-sm transition ease-linear duration-150 shadow-orange-300 rounded-sm sm:justify-normal gap-2 my-2 w-full ${
                isActive
                  ? "  text-orange-300  sm:shadow-sm sm:px-4 sm:py-2 sm:rounded-sm"
                  : "sm:px-4 py-2"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FaCloudSun className={isActive ? " text-[15px]" : ""} />
                <span className="hidden sm:block">Weather</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center  justify-evenly hover:shadow-sm transition ease-linear duration-150 shadow-orange-300 rounded-sm sm:justify-normal gap-2 my-2 w-full ${
                isActive
                  ? " text-orange-300  sm:shadow-sm sm:px-4 sm:py-2 sm:rounded-sm"
                  : "sm:px-4 py-2"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FaChartLine className={isActive ? " text-[15px]" : ""} />
                <span className="hidden sm:block">Analytics</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/setting"
            className={({ isActive }) =>
              `flex items-center justify-evenly hover:shadow-sm transition ease-linear duration-150 shadow-orange-300 rounded-sm sm:justify-normal gap-2 my-2 w-full ${
                isActive ||
                window.location.pathname.startsWith("/about") ||
                window.location.pathname.startsWith("/account") ||
                window.location.pathname.startsWith("/privacy") ||
                window.location.pathname.startsWith("/help")
                  ? "  text-orange-300  sm:shadow-sm sm:px-4 sm:py-2 sm:rounded-sm"
                  : "sm:px-4 py-2"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FaUserCircle
                  className={
                    isActive ||
                    window.location.pathname.startsWith("/about") ||
                    window.location.pathname.startsWith("/account") ||
                    window.location.pathname.startsWith("/privacy") ||
                    window.location.pathname.startsWith("/help")
                      ? "  text-[15px]"
                      : ""
                  }
                />
                <span className="hidden sm:block">Profile</span>
              </>
            )}
          </NavLink>
        </ul>
      </nav>
    </>
  );
};
