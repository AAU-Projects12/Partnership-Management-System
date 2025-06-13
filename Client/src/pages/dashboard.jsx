// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2"; // Added Pie for the new chart
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from "chart.js"; // Added ArcElement for Pie chart
import NavBar from "../components/NavBar";
import { getPartnerships } from "../api";
import { toast } from "react-hot-toast";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("Monthly");
  const [collegeFilter, setCollegeFilter] = useState("All Colleges");
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);

  const colleges = [
    "All Colleges",
    "Central",
    "College of Business and Economics",
    "College of Social Science, Arts and Humanities",
    "College of Veterinary Medicine and Agriculture",
    "School of Law",
    "College of Technology and Built Environment",
    "College of Education and Language Studies",
    "College of Health Science",
  ];

  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        setLoading(true);
        const params = {};
        if (collegeFilter !== "All Colleges") {
          params.college = collegeFilter;
        }
        const response = await getPartnerships(params);
        // Extract partnerships array from response
        const data = Array.isArray(response.data.partnerships) ? response.data.partnerships : [];
        console.log("Fetched partnerships:", data); // Debug
        setPartnerships(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching partnerships:", error);
        toast.error(error.response?.data?.message || "Failed to fetch partnerships");
        setPartnerships([]);
        setLoading(false);
      }
    };

    fetchPartnerships();
  }, [collegeFilter]);

  const processChartData = () => {
    if (!Array.isArray(partnerships)) {
      return { collegeData: {}, totalData: { active: 0, expiringSoon: 0, expired: 0, prospect: 0 } };
    }

    const now = new Date();
    let startDate;
    if (timeFilter === "Weekly") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeFilter === "Monthly") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (timeFilter === "Yearly") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    } else {
      startDate = new Date(0);
    }

    const filteredPartnerships = partnerships.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= startDate
    );

    const processedPartnerships = filteredPartnerships.map((p) => {
      const expirationDate = p.expirationDate ? new Date(p.expirationDate) : null;
      let derivedStatus = p.status ? p.status.toLowerCase() : "pending";
      if (expirationDate && p.status === "Active") {
        const daysUntilExpiration = (expirationDate - now) / (1000 * 60 * 60 * 24);
        derivedStatus = daysUntilExpiration <= 30 ? "expiringSoon" : "active";
      } else if (derivedStatus === "rejected") {
        derivedStatus = "expired";
      } else if (derivedStatus === "pending") {
        derivedStatus = "prospect";
      }
      return { ...p, derivedStatus };
    });

    const collegeData = colleges.reduce((acc, college) => {
      if (college === "All Colleges") return acc;
      const collegePartnerships = processedPartnerships.filter(
        (p) => p.aauContact?.interestedCollegeOrDepartment === college || collegeFilter === "All Colleges"
      );
      acc[college] = {
        active: collegePartnerships.filter((p) => p.derivedStatus === "active").length,
        expiringSoon: collegePartnerships.filter((p) => p.derivedStatus === "expiringSoon").length,
        expired: collegePartnerships.filter((p) => p.derivedStatus === "expired").length,
        prospect: collegePartnerships.filter((p) => p.derivedStatus === "prospect").length,
      };
      return acc;
    }, {});

    const totalData = processedPartnerships.reduce(
      (acc, p) => {
        acc[p.derivedStatus] = (acc[p.derivedStatus] || 0) + 1;
        return acc;
      },
      { active: 0, expiringSoon: 0, expired: 0, prospect: 0 }
    );

    return { collegeData, totalData };
  };

  const processLineData = () => {
    if (!Array.isArray(partnerships)) {
      return { months: [], lineDataByCollege: {} };
    }

    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return date.toLocaleString("default", { month: "short" }).toUpperCase();
    });

    const lineDataByCollege = colleges.reduce((acc, college) => {
      if (college === "All Colleges") return acc;
      acc[college] = {
        active: new Array(12).fill(0),
        expired: new Array(12).fill(0),
        expiringSoon: new Array(12).fill(0),
        prospect: new Array(12).fill(0),
      };
      return acc;
    }, {
      "All Colleges": {
        active: new Array(12).fill(0),
        expired: new Array(12).fill(0),
        expiringSoon: new Array(12).fill(0),
        prospect: new Array(12).fill(0),
      },
    });

    partnerships.forEach((p) => {
      if (!p.createdAt || !p.aauContact?.interestedCollegeOrDepartment) return;
      const expirationDate = p.expirationDate ? new Date(p.expirationDate) : null;
      let derivedStatus = p.status ? p.status.toLowerCase() : "pending";
      if (expirationDate && p.status === "Active") {
        const daysUntilExpiration = (expirationDate - now) / (1000 * 60 * 60 * 24);
        derivedStatus = daysUntilExpiration <= 30 ? "expiringSoon" : "active";
      } else if (derivedStatus === "rejected") {
        derivedStatus = "expired";
      } else if (derivedStatus === "pending") {
        derivedStatus = "prospect";
      }
      const createdDate = new Date(p.createdAt);
      const monthIndex = (createdDate.getFullYear() - now.getFullYear()) * 12 + createdDate.getMonth() - (now.getMonth() - 11);
      if (monthIndex >= 0 && monthIndex < 12) {
        if (collegeFilter === "All Colleges" || p.aauContact.interestedCollegeOrDepartment === collegeFilter) {
          lineDataByCollege[p.aauContact.interestedCollegeOrDepartment][derivedStatus][monthIndex]++;
          lineDataByCollege["All Colleges"][derivedStatus][monthIndex]++;
        }
      }
    });

    return { months, lineDataByCollege };
  };

  const processPieData = () => {
    if (!Array.isArray(partnerships)) {
      return {
        labels: [],
        datasets: [{ data: [], backgroundColor: [] }],
      };
    }

    const collegeCounts = colleges.reduce((acc, college) => {
      if (college !== "All Colleges") {
        const count = partnerships.filter(
          (p) => p.aauContact?.interestedCollegeOrDepartment === college
        ).length;
        if (count > 0) acc[college] = count;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(collegeCounts),
      datasets: [
        {
          data: Object.values(collegeCounts),
          backgroundColor: [
            "#1F2A44",
            "#3B82F6",
            "#93C5FD",
            "#D1D5DB",
            "#A855F7",
            "#F59E0B",
            "#10B981",
            "#F472B6",
          ], // Colors for each college
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    };
  };

  const { collegeData, totalData } = processChartData();
  const { months, lineDataByCollege } = processLineData();
  const pieData = processPieData();

  const selectedCollegeData = collegeFilter === "All Colleges" ? totalData : collegeData[collegeFilter] || { active: 0, expiringSoon: 0, expired: 0, prospect: 0 };
  const barData = {
    labels: ["Active Partners", "Expiring Soon", "Expired", "Prospect"],
    datasets: [
      {
        label: "Units",
        data: [
          selectedCollegeData.active,
          selectedCollegeData.expiringSoon,
          selectedCollegeData.expired,
          selectedCollegeData.prospect,
        ],
        backgroundColor: ["#1F2A44", "#3B82F6", "#93C5FD", "#D1D5DB"],
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y",
    scales: {
      x: { beginAtZero: true, max: 200, ticks: { stepSize: 50 } },
      y: { ticks: { font: { size: 14 } } },
    },
    plugins: { legend: { display: false } },
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Active",
        data: lineDataByCollege[collegeFilter]?.active || lineDataByCollege["All Colleges"].active,
        borderColor: "#3B82F6",
        fill: false,
      },
      {
        label: "Expired",
        data: lineDataByCollege[collegeFilter]?.expired || lineDataByCollege["All Colleges"].expired,
        borderColor: "#A855F7",
        fill: false,
      },
      {
        label: "Expiring Soon",
        data: lineDataByCollege[collegeFilter]?.expiringSoon || lineDataByCollege["All Colleges"].expiringSoon,
        borderColor: "#F59E0B",
        fill: false,
      },
      {
        label: "Prospect",
        data: lineDataByCollege[collegeFilter]?.prospect || lineDataByCollege["All Colleges"].prospect,
        borderColor: "#D1D5DB",
        fill: false,
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: { beginAtZero: true, max: 70, ticks: { stepSize: 10 } },
      x: { ticks: { font: { size: 12 } } },
    },
    plugins: { legend: { position: "bottom" } },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Partnerships by College",
        font: { size: 14 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Partnership Statistics</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search Partners"
                className="w-full sm:w-64 pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">×</span>
            </div>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
            <Link
              to="/add-partnership"
              className="bg-[#004165] hover:bg-[#00334e] text-white rounded-full px-6 py-2 flex items-center justify-center transition-colors"
            >
              + New Partner
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004165]"></div>
            <span className="ml-3 text-[#004165] font-medium">Loading...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              {/* Left Column: Units Per Status */}
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md lg:col-span-1">
                <h2 className="text-2xl lg:text-4xl font-bold text-gray-800">
                  {selectedCollegeData.active + selectedCollegeData.expiringSoon + selectedCollegeData.expired + selectedCollegeData.prospect} Partners
                </h2>
                <p className="text-gray-600 mt-2">Units Per Status</p>
                <div className="mt-4">
                  <Bar data={barData} options={barOptions} height={100} />
                </div>
              </div>

              {/* Middle Two Columns: Active Partners and Pending Applications */}
              <div className="lg:col-span-2">
                <div className="flex flex-col space-y-4 lg:space-y-6">
                  <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">{selectedCollegeData.active} Partners</h2>
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-600">Active Partners</p>
                      <p className="text-green-500 font-semibold">+15%</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Ongoing: {Math.round(selectedCollegeData.active * 0.9)}</span>
                      <span>Closing: {Math.round(selectedCollegeData.active * 0.1)}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                      {Math.round((selectedCollegeData.expiringSoon + selectedCollegeData.prospect) * 0.5)}
                    </h2>
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
              </div>

              {/* Top-Right: New Pie Chart */}
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md lg:col-span-1 h-64">
                <h2 className="text-lg font-medium text-gray-800 mb-2">College Distribution</h2>
                <div className="h-40">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                <h2 className="text-lg font-medium text-gray-800">Partnership Status</h2>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setTimeFilter("Weekly")}
                    className={`px-3 py-1 rounded-md text-sm ${timeFilter === "Weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} cursor-pointer`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setTimeFilter("Monthly")}
                    className={`px-3 py-1 rounded-md text-sm ${timeFilter === "Monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} cursor-pointer`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeFilter("Yearly")}
                    className={`px-3 py-1 rounded-md text-sm ${timeFilter === "Yearly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} cursor-pointer`}
                  >
                    Yearly
                  </button>
                  <button
                    onClick={() => setTimeFilter("All Times")}
                    className={`px-3 py-1 rounded-md text-sm ${timeFilter === "All Times" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"} cursor-pointer`}
                  >
                    All Times
                  </button>
                </div>
              </div>
              <Line data={lineData} options={lineOptions} height={80} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;