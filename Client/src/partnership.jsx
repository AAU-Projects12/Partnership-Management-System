"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  ChevronDown,
} from "lucide-react";
// import {AAU_logo} from "./assets/AAU_logo.png"

// Navigation Item Component
const NavItem = ({ icon, label, active = false }) => (
  <div
    className={`px-6 py-4 flex items-center gap-2 font-medium ${
      active ? "border-b-2 border-[#004165] text-[#004165]" : "text-gray-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

// Partner Row Component
const PartnerRow = ({ logo, name, type, duration, contact, status }) => (
  <div className="grid grid-cols-8 gap-4 p-4 border-b border-[#D9D9D9] items-center text-sm">
    <div className="flex items-center justify-center">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
    </div>
    <div>
      <img
        src={logo || "/placeholder.svg"}
        alt={name}
        className="w-8 h-8 rounded-full"
      />
    </div>
    <div className="font-medium text-[#004165]">{name}</div>
    <div>{type}</div>
    <div>{duration}</div>
    <div>{contact}</div>
    <div>
      <span
        className={`inline-flex px-4 py-1 rounded-full text-sm font-medium ${
          status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {status === "active" ? "Active" : "Expired"}
      </span>
    </div>
    <div className="flex gap-2">
      <button className="p-1 text-gray-500 hover:text-gray-700">
        <Trash2 className="h-4 w-4" />
      </button>
      <button className="p-1 text-gray-500 hover:text-gray-700">
        <Edit className="h-4 w-4" />
      </button>
      <button className="p-1 text-gray-500 hover:text-gray-700">
        <Eye className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// Main Component
const PartnershipDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const partners = [
    {
      id: 1,
      logo: "/placeholder.svg",
      name: "Turkish Foundation",
      type: "Research",
      duration: "1 year",
      contact: "Mr. Johness",
      status: "expired",
    },
    {
      id: 2,
      logo: "/placeholder.svg",
      name: "Civil Society",
      type: "Research",
      duration: "5 Months",
      contact: "Mr. Johness",
      status: "active",
    },
    {
      id: 3,
      logo: "/placeholder.svg",
      name: "Minstry Of Education",
      type: "Research",
      duration: "2 year",
      contact: "Mr. Johness",
      status: "active",
    },
    {
      id: 4,
      logo: "/placeholder.svg",
      name: "Ovid Holdings",
      type: "Research",
      duration: "1.5 year",
      contact: "Mr. Johness",
      status: "active",
    },
    {
        id: 4,
        logo: "/placeholder.svg",
        name: "Ovid Holdings",
        type: "Research",
        duration: "1.5 year",
        contact: "Mr. Johness",
        status: "active",
      },
      {
        id: 4,
        logo: "/placeholder.svg",
        name: "Ovid Holdings",
        type: "Research",
        duration: "1.5 year",
        contact: "Mr. Johness",
        status: "active",
      },
      {
        id: 4,
        logo: "/placeholder.svg",
        name: "Ovid Holdings",
        type: "Research",
        duration: "1.5 year",
        contact: "Mr. Johness",
        status: "active",
      },
      {
        id: 4,
        logo: "/placeholder.svg",
        name: "Ovid Holdings",
        type: "Research",
        duration: "1.5 year",
        contact: "Mr. Johness",
        status: "active",
      },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#004165] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-full  p-1 w-14 h-14 flex items-center justify-center">
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
      <nav className="bg-white border-b">
        <div className="container mx-auto flex">
          <NavItem
            icon={
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
              </div>
            }
            label="Dashboard"
          />
          <NavItem
            icon={
              <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                <div className="w-2 h-2 border-t-2 border-current rotate-45 translate-y-[1px]"></div>
              </div>
            }
            label="Partnerships"
            active
          />
          <NavItem
            icon={
              <div className="w-4 h-4">
                <div className="w-4 h-2 border-2 border-current rounded-full"></div>
                <div className="w-4 h-2 bg-current rounded-full mt-0.5"></div>
              </div>
            }
            label="Users"
          />
          <NavItem
            icon={
              <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </div>
            }
            label="Settings"
          />
          <NavItem
            icon={
              <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                <div className="w-2 h-0.5 bg-current"></div>
              </div>
            }
            label="Profile"
          />
          <div className="ml-auto">
            <NavItem
              icon={
                <div className="w-4 h-4 flex items-center">
                  <div className="w-3 h-3 border-t-2 border-r-2 border-current rotate-45"></div>
                </div>
              }
              label="Logout"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8 px-8">
        <div className="container mx-auto">
          {/* Active Partnership Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Active Partnership</h2>
              <p className="text-[#004165] text-sm mt-0.5">
                Explore details about active agreements, project focus areas,
                and partner organizations.
              </p>
            </div>
            <button className="bg-[#004165] hover:bg-[#00334e] text-white rounded-full px-6 py-2 flex items-center">
              <Plus className="mr-2 h-4 w-4" /> New Partner
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-[#DBE4E9] rounded-full p-6 mb-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Partners"
                  className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-200 focus:outline-none hover:border-[#00334e] bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-2.5"
                    onClick={() => setSearchQuery("")}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button className="border border-gray-300 rounded-full px-4 py-2">
                <Filter className="h-4 w-4" />
              </button>

              {/* Filter Buttons Section */}
              <div className="bg-[#6D91A7] rounded-full flex items-center px-2">
                <button className="rounded-full bg-white text-xs px-4 py-1 h-8">
                  Name
                </button>
                <button className="rounded-full  text-xs px-4 py-1 h-8">
                  Category
                </button>
                <button className="rounded-full  text-xs px-4 py-1 h-8">
                  Region
                </button>
                <button className="rounded-full  text-xs px-4 py-1 h-8">
                  Time Left
                </button>
              </div>
            </div>
          </div>

          {/* Partnership Lists */}
          <div className="bg-[#DBE4E9] rounded-3xl pt-6">
            <h3 className="text-lg font-bold mb-6 ml-6">Partnership Lists</h3>
            <div className="bg-white rounded-b-3xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-8 gap-4 p-4 border-b-0.5 text-gray-600 font-medium shadow-md">
                <div className="flex items-center justify-center">
                </div>
                <div>LOGO</div>
                <div>PARTNER'S NAME</div>
                <div>TYPE</div>
                <div>DURATION</div>
                <div>LEAD CONTACT</div>
                <div>STATUS</div>
                <div>ACTIONS</div>
              </div>

              {/* Table Rows */}
              {partners.map((partner) => (
                <PartnerRow
                  key={partner.id}
                  logo={partner.logo}
                  name={partner.name}
                  type={partner.type}
                  duration={partner.duration}
                  contact={partner.contact}
                  status={partner.status}
                />
              ))}

              {/* Show More Button */}
              <div className="flex justify-center p-2 border-t border-[#004165]">
                <button className="text-gray-500 p-1">
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnershipDashboard;
