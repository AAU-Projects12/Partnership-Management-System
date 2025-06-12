import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signUp } from "../api";
import { toast } from "react-hot-toast";
import { Check, ChevronDown } from "lucide-react";
import { Eye, EyeClosed } from "lucide-react";
import aauLogo from "../assets/aauLogo.png";
import aauimg from "../assets/aauimg.png";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";
import logo7 from "../assets/logo7.png";
import logo8 from "../assets/logo8.png";
import logo9 from "../assets/logo9.png";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [researchInstitute, setResearchInstitute] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const departments = ["Central", "College", "Research Institute"];
  // List of AAU colleges
  const colleges = [
    "College of Business and Economics",
    "College of Social Science, Arts and Humanities",
    "College of Veterinary Medicine and Agriculture",
    "School of Law",
    "College of Technology and Built Environment",
    "College of Natural and Computational Sciences",
    "College of Education and Language Studies",
    "College of Health Science",
  ];
  const researchInstitutes = [
    "Institute of Advanced Science and Technology",
    "Institute of Geophysics, Space Science, Astronomy",
    "Institute of Peace and Security Studies",
    "Institute of Social and Economic Research (ISER)	",
    "Aklilu Lemma Institute of Health Research (AL-IHR) ",
    "Institute of Ethiopian Studies (IES)",
    "Institute of Water, Environment and Climate Research (IEWCR)",
  ];
  const departmentController = (department) => {
    if (department === "College") {
      return (
        <div className="relative">
          <div
            className={`border-2 w-full ${
              errors.college ? "border-red-500" : "border-[#00588b]"
            } rounded-full px-4 py-3 flex justify-between items-center cursor-pointer`}
            onClick={() => setDropdownOpen2(!dropdownOpen2)}
          >
            <span
              className={
                college ? "text-black truncate" : "text-gray-500 text-sm"
              }
            >
              {college || "Select College"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                dropdownOpen2 ? "rotate-180" : ""
              }`}
            />
          </div>

          {dropdownOpen2 && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {colleges.map((item, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    college === item ? "bg-[#00588b]/10 font-medium" : ""
                  }`}
                  onClick={() => selectCollege(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {errors.college && (
            <p className="text-red-500 text-sm mt-1 ml-4">{errors.college}</p>
          )}
        </div>
      );
    } else if (department === "Research Institute") {
      return (
        <div className="relative">
          <div
            className={`border-2 w-full ${
              errors.researchInstitute ? "border-red-500" : "border-[#00588b]"
            } rounded-full px-4 py-3 flex justify-between items-center cursor-pointer`}
            onClick={() => setDropdownOpen2(!dropdownOpen2)}
          >
            <span
              className={
                researchInstitute
                  ? "text-black truncate"
                  : "text-gray-500 text-sm"
              }
            >
              {researchInstitute || "Select Research Institute"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                dropdownOpen2 ? "rotate-180" : ""
              }`}
            />
          </div>

          {dropdownOpen2 && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {researchInstitutes.map((item, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    researchInstitute === item
                      ? "bg-[#00588b]/10 font-medium"
                      : ""
                  }`}
                  onClick={() => selectResearchInstitute(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {errors.researchInstitute && (
            <p className="text-red-500 text-sm mt-1 ml-4">
              {errors.researchInstitute}
            </p>
          )}
        </div>
      );
    }
  };
  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required!`;
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Please enter a valid email address";
    } else if (name === "password" && value.length < 8) {
      error = "Password must be at least 8 characters long";
    } else if (name === "confirmPassword" && value !== password) {
      error = "Passwords do not match";
      gs;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        if (confirmPassword) {
          validateField("confirmPassword", confirmPassword);
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);

        break;
      case "department":
        setDepartment(value);
        break;
      case "college":
        setCollege(value);
        break;
      case "researchInstitute":
        setResearchInstitute(value);
        break;
    }

    validateField(name, value);
  };

  const selectDepartment = (selected) => {
    setDepartment(selected);
    setDropdownOpen(false);
    validateField("department", selected);
  };

  const selectCollege = (selected) => {
    setCollege(selected);
    setDropdownOpen2(false);
    validateField("college", selected);
  };
  const selectResearchInstitute = (selected) => {
    setResearchInstitute(selected);
    setDropdownOpen2(false);
    validateField("researchInstitute", selected);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate all fields
    const isFirstNameValid = validateField("firstName", firstName);
    const isLastNameValid = validateField("lastName", lastName);
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);
    const isConfirmPasswordValid = validateField(
      "confirmPassword",
      confirmPassword
    );

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      try {
        await signUp({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        });
        toast.success("User successfully Registered!");
      } catch (error) {
        toast.error("Registration failed. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="main-container bg-white w-full min-h-screen relative overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-[#014166] shadow-md z-10 py-4 px-6 flex flex-col sm:flex-row items-center sm:justify-start gap-4 text-white text-sm font-bold">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope w-4 h-4"></i>
          <span>Email: vpsci@aau.edu.et</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-phone w-4 h-4"></i>
          <span>+251-118-278433 or +251-111-239706</span>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        {/* Image*/}
        <div className="relative bg-[#014166] w-full lg:w-1/2 h-[450px] lg:h-auto rounded-br-[300px] overflow-hidden">
          <img
            src={aauimg}
            alt="background"
            className="absolute top-0 left-0 w-full h-full object-cover z-10 opacity-70"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 text-center relative z-20">
          <img src={aauLogo} alt="logo" className="w-20 mb-4" />
          <h1 className="text-2xl lg:text-3xl font-bold text-black">
            Addis Ababa University
          </h1>
          <p className="text-lg font-medium mt-2">
            PARTNERSHIP MANAGEMENT SYSTEM
          </p>
          <p className="text-[#00578a] mt-4 text-lg">Super Admin SignUp</p>
          <p className="text-gray-500 mt-2 max-w-md">
            Welcome to the Addis Ababa University Partnership Management System
          </p>

          {/* Input Fields */}
          <form
            className="mt-6 w-full max-w-sm flex flex-col gap-4"
            onSubmit={handleSignup}
          >
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={`border-2 w-full ${
                  errors.firstName ? "border-red-500" : "border-[#00588b]"
                } rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500`}
                onChange={handleChange}
                value={firstName}
                onBlur={(e) => validateField("firstName", e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={`border-2 w-full ${
                  errors.lastName ? "border-red-500" : "border-[#00588b]"
                } rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500`}
                onChange={handleChange}
                value={lastName}
                onBlur={(e) => validateField("lastName", e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`border-2 w-full ${
                  errors.email ? "border-red-500" : "border-[#00588b]"
                } rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500`}
                onChange={handleChange}
                value={email}
                onBlur={(e) => validateField("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-4">{errors.email}</p>
              )}
            </div>
            {/* College Dropdown */}
            <div className="relative">
              <div
                className={`border-2 w-full ${
                  errors.department ? "border-red-500" : "border-[#00588b]"
                } rounded-full px-4 py-3 flex justify-between items-center cursor-pointer`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span
                  className={
                    department ? "text-black truncate" : "text-gray-500 text-sm"
                  }
                >
                  {department || "Select Institution Type"}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {departments.map((item, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        department === item ? "bg-[#00588b]/10 font-medium" : ""
                      }`}
                      onClick={() => selectDepartment(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {errors.college && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {errors.college}
                </p>
              )}
            </div>
            {department === "College" && departmentController("College")}
            {department === "Research Institute" &&
              departmentController("Research Institute")}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`border-2 w-full ${
                  errors.password ? "border-red-500" : "border-[#00588b]"
                } rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500`}
                onChange={handleChange}
                value={password}
                onBlur={(e) => validateField("password", e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
              >
                {showPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`border-2 w-full ${
                  errors.confirmPassword ? "border-red-500" : "border-[#00588b]"
                } rounded-full px-4 py-3 placeholder:text-sm placeholder:text-gray-500`}
                onChange={handleChange}
                value={confirmPassword}
                onBlur={(e) => validateField("confirmPassword", e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
              >
                {showConfirmPassword ? (
                  <EyeClosed className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 ml-4">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center bg-[#00588b] text-white px-6 py-3 mt-6 rounded-full gap-2 hover:bg-[#004a75] transition"
            >
              Sign Up
              <img
                src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-04/YvWR34sXt7.png"
                alt="arrow"
                className="w-5 h-5"
              />
            </button>
          </form>
          <p className="mt-4 text-lg">
            Already have an Account?{" "}
            <Link
              className="text-[#00578a] underline hover:no-underline"
              to="/"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full bg-white shadow-md py-6 flex flex-wrap justify-center items-center gap-4 mt-auto px-4">
        `<img src={logo1} className="h-16 w-auto" />
        <img src={logo2} className="h-16 w-auto" />
        <img src={logo3} className="h-16 w-auto" />
        <img src={logo4} className="h-16 w-auto" />
        <img src={logo5} className="h-16 w-auto" />
        <img src={logo6} className="h-16 w-auto" />
        <img src={logo7} className="h-16 w-auto" />
        <img src={logo8} className="h-16 w-auto" />
        <img src={logo9} className="h-16 w-auto" />`
      </div>
    </div>
  );
}
