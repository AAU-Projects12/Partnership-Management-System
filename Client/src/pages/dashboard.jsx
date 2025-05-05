import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import NavBar from '../components/NavBar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  // State for time filter (Weekly, Monthly, Yearly, All Times)
  const [timeFilter, setTimeFilter] = useState('Monthly');
  // State for college filter
  const [collegeFilter, setCollegeFilter] = useState('All Colleges');

  // List of AAU colleges
  const colleges = [
    'All Colleges',
    'College of Business and Economics',
    'College of Social Science, Arts and Humanities',
    'College of Veterinary Medicine and Agriculture',
    'School of Law',
    'College of Technology and Built Environment',
    'College of Natural and Computational Sciences',
    'College of Education and Language Studies',
    'College of Health Science',
  ];

  // College data
  const collegeData = {
    'College of Business and Economics': { active: 25, expiringSoon: 5, expired: 1, prospect: 1 },
    'College of Social Science, Arts and Humanities': { active: 20, expiringSoon: 4, expired: 2, prospect: 1 },
    'College of Veterinary Medicine and Agriculture': { active: 5, expiringSoon: 1, expired: 0, prospect: 0 },
    'School of Law': { active: 10, expiringSoon: 2, expired: 0, prospect: 0 },
    'College of Technology and Built Environment': { active: 15, expiringSoon: 3, expired: 1, prospect: 1 },
    'College of Natural and Computational Sciences': { active: 50, expiringSoon: 10, expired: 5, prospect: 2 },
    'College of Education and Language Studies': { active: 12, expiringSoon: 2, expired: 0, prospect: 0 },
    'College of Health Science': { active: 30, expiringSoon: 6, expired: 2, prospect: 1 },
  };

  // Calculate total data for "All Colleges"
  const totalData = colleges.reduce((acc, college) => {
    if (college === 'All Colleges') return acc;
    const data = collegeData[college];
    return {
      active: acc.active + data.active,
      expiringSoon: acc.expiringSoon + data.expiringSoon,
      expired: acc.expired + data.expired,
      prospect: acc.prospect + data.prospect,
    };
  }, { active: 0, expiringSoon: 0, expired: 0, prospect: 0 });

  // Data for the Bar Chart (Units Per Status)
  const selectedCollegeData = collegeFilter === 'All Colleges' ? totalData : collegeData[collegeFilter];
  const barData = {
    labels: ['Active Partners', 'Expiring Soon', 'Expired', 'Prospect'],
    datasets: [
      {
        label: 'Units',
        data: [
          selectedCollegeData.active,
          selectedCollegeData.expiringSoon,
          selectedCollegeData.expired,
          selectedCollegeData.prospect,
        ],
        backgroundColor: ['#1F2A44', '#3B82F6', '#93C5FD', '#D1D5DB'],
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true, max: 200, ticks: { stepSize: 50 } },
      y: { ticks: { font: { size: 14 } } },
    },
    plugins: { legend: { display: false } },
  };

  // Mock line chart data for colleges
  const collegeLineData = {
    'All Colleges': {
      active: [30, 40, 35, 50, 45, 60, 55, 70, 65, 60, 50, 45],
      expired: [10, 15, 20, 25, 30, 35, 30, 25, 20, 15, 10, 5],
      expiringSoon: [5, 10, 15, 20, 25, 30, 35, 30, 25, 20, 15, 10],
    },
    'College of Business and Economics': {
      active: [15, 20, 18, 25, 22, 30, 28, 35, 32, 30, 25, 22],
      expired: [2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
      expiringSoon: [3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2],
    },
    'College of Social Science, Arts and Humanities': {
      active: [12, 15, 14, 20, 18, 25, 22, 30, 28, 25, 20, 18],
      expired: [2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
      expiringSoon: [2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
    },
    'College of Veterinary Medicine and Agriculture': {
      active: [3, 4, 3, 5, 4, 6, 5, 7, 6, 5, 4, 3],
      expired: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expiringSoon: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    'School of Law': {
      active: [6, 8, 7, 10, 9, 12, 11, 14, 13, 12, 10, 8],
      expired: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expiringSoon: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
    },
    'College of Technology and Built Environment': {
      active: [10, 12, 11, 15, 13, 18, 16, 20, 18, 16, 14, 12],
      expired: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      expiringSoon: [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2],
    },
    'College of Natural and Computational Sciences': {
      active: [30, 35, 32, 50, 45, 60, 55, 70, 65, 60, 50, 45],
      expired: [5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4],
      expiringSoon: [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5],
    },
    'College of Education and Language Studies': {
      active: [7, 9, 8, 12, 10, 14, 13, 16, 15, 14, 12, 10],
      expired: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      expiringSoon: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
    },
    'College of Health Science': {
      active: [20, 25, 22, 30, 28, 35, 32, 40, 38, 35, 30, 28],
      expired: [2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
      expiringSoon: [4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3],
    },
  };

  const lineData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: [
      {
        label: 'Active',
        data: collegeLineData[collegeFilter]?.active || collegeLineData['All Colleges'].active,
        borderColor: '#3B82F6',
        fill: false,
      },
      {
        label: 'Expired',
        data: collegeLineData[collegeFilter]?.expired || collegeLineData['All Colleges'].expired,
        borderColor: '#A855F7',
        fill: false,
      },
      {
        label: 'Expiring Soon',
        data: collegeLineData[collegeFilter]?.expiringSoon || collegeLineData['All Colleges'].expiringSoon,
        borderColor: '#F59E0B',
        fill: false,
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: { beginAtZero: true, max: 70, ticks: { stepSize: 10 } },
      x: { ticks: { font: { size: 12 } } },
    },
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Partnership Statistics</h1>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Partners"
                className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">×</span>
            </div>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
            <Link
              to="/add-partnership"
              className="bg-[#004165] hover:bg-[#00334e] text-white rounded-full px-6 py-2 flex items-center transition-colors"
            >
              + New Partner
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Partners */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-gray-800">{selectedCollegeData.active + selectedCollegeData.expiringSoon + selectedCollegeData.expired + selectedCollegeData.prospect} Partners</h2>
            <p className="text-gray-600 mt-2">Units Per Status</p>
            <div className="mt-4">
              <Bar data={barData} options={barOptions} height={100} />
            </div>
          </div>

          {/* Active Partners and Pending Applications */}
          <div className="flex flex-col space-y-6">
            {/* Active Partners */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold text-gray-800">{selectedCollegeData.active} Partners</h2>
              <div className="flex justify-between mt-2">
                <p className="text-gray-600">Active Partners</p>
                <p className="text-green-500 font-semibold">+15%</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Ongoing: {Math.round(selectedCollegeData.active * 0.9)}</span>
                <span>Closing: {Math.round(selectedCollegeData.active * 0.1)}</span>
              </div>
            </div>

            {/* Pending Applications */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold text-gray-800">{Math.round((selectedCollegeData.expiringSoon + selectedCollegeData.prospect) * 0.5)}</h2>
              <div className="flex justify-between mt-2">
                <p className="text-gray-600">Pending Applications</p>
                <p className="text-red-500 font-semibold">-5%</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Partners: {selectedCollegeData.active + selectedCollegeData.expiringSoon + selectedCollegeData.expired + selectedCollegeData.prospect}</span>
                <span>Deals: {Math.round(selectedCollegeData.expiringSoon * 0.5)}</span>
              </div>
            </div>
          </div>

          {/* Graph Description and Revenue Contribution */}
          <div className="flex flex-col space-y-6">
            {/* Graph Description */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600">Graph Description</p>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-gray-300 rounded mr-2"></span>
                  <span>Expired Soon</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-gray-600 rounded mr-2"></span>
                  <span>Expired</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-blue-600 rounded mr-2"></span>
                  <span>Active</span>
                </div>
              </div>
            </div>

            {/* Revenue Contribution */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-3xl font-bold text-gray-800">${Math.round((selectedCollegeData.active + selectedCollegeData.expiringSoon) * 0.75)} M</h2>
              <div className="flex justify-between mt-2">
                <p className="text-gray-600">Revenue Contribution</p>
                <p className="text-green-500 font-semibold">+25%</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Ongoing: {Math.round(selectedCollegeData.active * 0.9)}</span>
                <span>Closing: {Math.round(selectedCollegeData.active * 0.1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Status Line Graph */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-800">Partnership Status</h2>
            <div className="flex space-x-1">
              <button
                onClick={() => setTimeFilter('Weekly')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'Weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} cursor-pointer`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeFilter('Monthly')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'Monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} cursor-pointer`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter('Yearly')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'Yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} cursor-pointer`}
              >
                Yearly
              </button>
              <button
                onClick={() => setTimeFilter('All Times')}
                className={`px-3 py-1 rounded-md text-sm ${timeFilter === 'All Times' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} cursor-pointer`}
              >
                All Times
              </button>
            </div>
          </div>
          <Line data={lineData} options={lineOptions} height={80} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;