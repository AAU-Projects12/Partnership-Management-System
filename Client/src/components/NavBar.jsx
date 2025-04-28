import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  UsersIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightEndOnRectangleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const NavBar = () => {
  const location = useLocation();
  
  // Function to check if the current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Header */}
      <header className="bg-[#004165] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-1 w-14 h-14 flex items-center justify-center">
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-04/DXFCdgcvP5.png"
                alt="Addis Ababa University Logo"
                className="w-15 h-12 rounded-full"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg">Addis Ababa University</h1>
              <p className="text-xs uppercase tracking-wider">
                Partnership Management System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-white">Email:</span>
              <a href="mailto:vpsci@aau.edu.et" className="text-white">
                vpsci@aau.edu.et
              </a>
            </div>
            <div className="flex items-center gap-1">
              <span>+251-118-278433 or +251-111-239706</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link 
            to="/dashboard" 
            className={`${isActive('/dashboard') ? 'text-gray-800 font-semibold' : 'text-gray-500 hover:text-blue-600'} flex items-center space-x-1`}
          >
            <Bars3Icon className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/partnership" 
            className={`${isActive('/partnership') ? 'text-gray-800 font-semibold' : 'text-gray-500 hover:text-blue-600'} flex items-center space-x-1`}
          >
            <UsersIcon className="w-5 h-5" />
            <span>Partnerships</span>
          </Link>
          <Link 
            to="/users" 
            className={`${isActive('/users') ? 'text-gray-800 font-semibold' : 'text-gray-500 hover:text-blue-600'} flex items-center space-x-1`}
          >
            <UsersIcon className="w-5 h-5" />
            <span>Users</span>
          </Link>
          <Link 
            to="/settings" 
            className={`${isActive('/settings') ? 'text-gray-800 font-semibold' : 'text-gray-500 hover:text-blue-600'} flex items-center space-x-1`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link 
            to="/profile" 
            className={`${isActive('/profile') ? 'text-gray-800 font-semibold' : 'text-gray-500 hover:text-blue-600'} flex items-center space-x-1`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
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
        </div>
      </nav>
    </>
  );
};

export default NavBar;