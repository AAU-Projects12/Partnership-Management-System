import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  PencilIcon,
  KeyIcon,
  ClockIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import NavBar from "../components/NavBar";
import { useUser } from "../context/UserContext";
import { updateUser } from "../api";
import toast from "react-hot-toast";
import { getUserActivityLogs } from "../api";

const Profile = () => {
  const { user: contextUser, logout, setContextUser } = useUser();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "Partnership Office",
    joinDate: new Date().toISOString(),
    profileImage: null,
  });

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: contextUser?.firstName || "",
    lastName: contextUser?.lastName || "",
    email: contextUser?.email || "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Activity log modal state
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    if (contextUser) {
      setUser({
        name: `${contextUser.firstName || ""} ${contextUser.lastName || ""}`.trim(),
        email: contextUser.email || "",
        role: contextUser.role || "User",
        department: contextUser.campusId ? "Department" : "Partnership Office",
        joinDate: new Date().toISOString(),
        profileImage: null,
      });
      setEditForm({
        firstName: contextUser.firstName || "",
        lastName: contextUser.lastName || "",
        email: contextUser.email || "",
      });
    }
  }, [contextUser]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      action: "Logged in",
      timestamp: "2023-06-15T10:30:00",
      details: "User logged in from 192.168.1.1",
    },
    {
      id: 2,
      action: "Updated partnership",
      timestamp: "2023-06-14T14:45:00",
      details: "Modified Turkish Foundation partnership details",
    },
    {
      id: 3,
      action: "Added new user",
      timestamp: "2023-06-12T09:15:00",
      details: "Created account for David Kim",
    },
    {
      id: 4,
      action: "Changed password",
      timestamp: "2023-06-10T16:20:00",
      details: "User changed their password",
    },
    {
      id: 5,
      action: "Exported report",
      timestamp: "2023-06-08T11:05:00",
      details: "Generated partnership status report",
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Edit Profile handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      // Only allow update if contextUser exists
      if (!contextUser?._id) throw new Error("User not found");
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
      };
      const res = await updateUser(contextUser._id, payload);
      // Update context and localStorage
      const updatedUser = { ...contextUser, ...payload };
      setContextUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditOpen(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      setEditError(
        err?.response?.data?.message || err.message || "Failed to update profile."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Fetch all activity logs
  const handleViewAllActivity = async () => {
    setIsActivityModalOpen(true);
    setActivityLoading(true);
    setActivityError("");
    try {
      const res = await getUserActivityLogs({ userId: contextUser?._id, limit: 100 });
      setActivityLogs(res.data.notifications || []);
    } catch (err) {
      setActivityError("Failed to fetch activity logs.");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <NavBar />

      {/* --- Edit Profile Modal --- */}
      {isEditOpen && (
        <>
          {/* Backdrop with stronger blur and darker overlay */}
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"></div>

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6 lg:p-8">
            <div
              className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 w-full max-w-md relative animate-fade-in-up"
              // Adding a subtle border color from our theme for a touch of elegance
              style={{ borderColor: "rgb(100, 45, 15, 0.1)" }}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setIsEditOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#014166] focus:border-[#014166] transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#014166] focus:border-[#014166] transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#014166] focus:border-[#014166] transition-all duration-200"
                    required
                  />
                </div>
                {editError && <div className="text-red-500 text-sm mt-2">{editError}</div>}
                <button
                  type="submit"
                  className="w-full bg-[#014166] text-white py-2.5 rounded-lg font-semibold hover:bg-[rgb(0,51,78)] transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white/80"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </form>
            </div>
          </div>
        </>
      )}


      {/* --- Main Profile Section --- */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#014166] mx-auto">My Profile</h1>

          </div>
          <div className="flex justify-center items-start w-full">
            {/* Profile Info Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 w-full max-w-md">
              <div className="p-8">
                <div className="flex flex-col items-center mb-6">
                  <div
                    className="h-28 w-28 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 border-4 border-white shadow-md"
                    style={{ backgroundColor: "#014166" }} // Using the new theme color
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h2>
                  <p className="text-base text-gray-600">{user.role}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.department}
                  </p>
                </div>
                <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-[#014166]">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-[#014166]">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="text-base font-medium text-gray-800">
                        {new Date(user.joinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <button
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#014166] transition-colors duration-200"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <PencilIcon className="h-5 w-5 mr-2 text-[#014166]" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/reset-password")}
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#014166] transition-colors duration-200"
                  >
                    <KeyIcon className="h-5 w-5 mr-2 text-[#014166]" />
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#014166] transition-colors duration-200"
                  >
                    <ArrowRightEndOnRectangleIcon className="w-5 h-5 mr-2 text-[#014166]" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
            {/* You would typically have other profile content here if it exists */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
