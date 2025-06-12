import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  UsersIcon,
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import UserProfileMenu from "./UserProfileMenu";
import aauLogo from "../assets/aauLogo.png";

const NavBar = () => {
  const location = useLocation();
  const { user } = useUser();

  // Function to check if the current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Header */}
      <div className="bg-[#004165] text-white py-4">
        <div className="w-full pl-10 flex justify-between items-center">
          <section className="z-30 flex items-center space-x-2 sm:space-x-4 cursor-pointer">
            <img
              src={aauLogo}
              alt="Logo"
              loading="lazy"
              width="400"
              height="400"
              decoding="async"
              className="h-10 sm:h-12 md:h-[52px] w-auto cursor-pointer"
              style={{ color: "transparent" }}
            />
            <div className="md:flex flex-col justify-center logoDescription space-y-0 pl-2 sm:pl-4 border-l-2 min-h-8 sm:min-h-12 border-white cursor-pointer">
              <div>
                <div className="text-white text-[17px] sm:text-[18px] tracking-[3px] leading-snug mt-[-4px]">
                  አዲስ አበባ ዩኒቨርሲቲ
                </div>
                <div className="text-red-600 text-[13px] sm:text-[13.5px] font-medium tracking-wide leading-snug mt-[-4px] sm:mt-[-5px]">
                  ADDIS ABABA UNIVERSITY
                </div>
              </div>
              <div className="text-gray-400 text-[13px] hidden md:flex">
                SINCE 1950
              </div>
            </div>
          </section>
          {/* Navigation */}
          <section className="bg-[#004165] justify-end pr-7 ">
            <div className="flex space-x-6">
              <Link
                to="/dashboard"
                className={`${
                  isActive("/dashboard")
                    ? "text-[#04B09E] font-semibold"
                    : "text-white hover:text-[#04B09E]"
                } flex items-center space-x-1 cursor-pointer`}
              >
                <Bars3Icon className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/partnership"
                className={`${
                  isActive("/partnership")
                    ? "text-[#04B09E] font-semibold"
                    : "text-white hover:text-[#04B09E]"
                } flex items-center space-x-1 cursor-pointer`}
              >
                <UsersIcon className="w-5 h-5" />
                <span>Partnerships</span>
              </Link>
              <Link
                to="/users"
                className={`${
                  isActive("/users")
                    ? "text-[#04B09E] font-semibold"
                    : "text-white hover:text-[#04B09E]"
                } flex items-center space-x-1 cursor-pointer`}
              >
                <UsersIcon className="w-5 h-5" />
                <span>Users</span>
              </Link>
              <Link
                to="/settings"
                className={`${
                  isActive("/settings")
                    ? "text-[#04B09E] font-semibold"
                    : "text-white hover:text-[#04B09E]"
                } flex items-center space-x-1 cursor-pointer`}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <Link
                to="/profile"
                className={`${
                  isActive("/profile")
                    ? "text-[#04B09E] font-semibold"
                    : "text-white hover:text-[#04B09E]"
                } flex items-center space-x-1 cursor-pointer`}
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>{" "}
              <div className="pl-4">
                <Link
                  to="/notifications"
                  className={`${
                    isActive("/notifications")
                      ? "text-[#04B09E] font-semibold"
                      : "text-white hover:text-[#04B09E]"
                  } flex items-center space-x-1 relative cursor-pointer`}
                >
                  <BellIcon className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </div>
                </Link>
              </div>
              {/* User Profile Menu */}
              <div className="pl-4">
                <UserProfileMenu />
              </div>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Link
                to="/notifications"
                className={`${isActive('/notifications') ? 'text-gray-800 font-semibold' : 'text-gray-500 hover:text-blue-600'} flex items-center space-x-1 relative`}
              >
                <BellIcon className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </div>
              </Link>
              <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center space-x-1">
                <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </Link>
            </div> */}
          </section>
        </div>
      </div>
    </>
  );
};

export default NavBar;
