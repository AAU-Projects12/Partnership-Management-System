import React, { useState } from 'react';
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import NavBar from '../components/NavBar';

const Users = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for filter
  const [activeFilter, setActiveFilter] = useState('Name');

  // Mock user data
  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Super-Admin' },
    { id: 2, name: 'Michael Lee', email: 'michael.lee@example.com', role: 'Admin' },
    { id: 3, name: 'Sofia Martinez', email: 'sofia.martinez@example.com', role: 'User' },
    { id: 4, name: 'David Kim', email: 'david.kim@example.com', role: 'Admin' },
  ];
  

  // Filter options
  const filterOptions = ['Name', 'Category', 'Region', 'Time Left'];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <button className="bg-[#004165] text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
            <span className="mr-1">+</span> Add User
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search Partners"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">×</span>
                </button>
              )}
            </div>
            <div className="flex items-center ml-4">
              <button className="p-2 text-gray-500 hover:text-blue-600 cursor-pointer">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <div className="flex ml-2 space-x-1">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setActiveFilter(option)}
                    className={`px-3 py-1 rounded-md text-sm ${activeFilter === option ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} cursor-pointer`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">User's Lists</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                  </th>
                  <th scope="col" className="px-7 py-3  text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROLE
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-start">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#004165] rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button className="text-red-600 hover:text-red-900 cursor-pointer">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 cursor-pointer">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 cursor-pointer">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center p-4">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;