import React, { useState } from "react";
import NavBar from "../components/NavBar";

import {
  Clipboard,
  Building,
  Calendar,
  MapPin,
  GraduationCap,
  ActivitySquare,
  FileText,
  User,
  Mail,
} from "lucide-react";

function AddPartnership() {
  // Form state
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    signedDate: "",
    endDate: "",
    region: "",
    college: "",
    status: "Active",
    description: "",
    contactPerson: "",
    contactEmail: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validate a single field
  const validateField = (name, value) => {
    // Only validate required fields
    const requiredFields = [
      "organizationName",
      "organizationType",
      "signedDate",
      "endDate",
      "region",
      "college",
      "status",
      "description",
    ];

    // Skip validation for optional fields
    if (!requiredFields.includes(name)) {
      return true;
    }

    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${
          name.charAt(0).toUpperCase() +
          name.slice(1).replace(/([A-Z])/g, " $1")
        } is required`,
      }));
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      return true;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change if form was already submitted once
    if (submitted) {
      validateField(name, value);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate all fields
    let formIsValid = true;

    Object.entries(formData).forEach(([name, value]) => {
      // Skip validation for optional fields
      if (name === "contactPerson" || name === "contactEmail") return;

      const isValid = validateField(name, value);
      if (!isValid) formIsValid = false;
    });

    if (formIsValid) {
      console.log("Form submitted:", formData);
      // Here you would typically send the data to your backend
      alert("Partnership added successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />

      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Partnership Details
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter the details of the new partnership
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Organization Name */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>Organization Name</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  placeholder="e.g. World Health Organization"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.organizationName
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organizationName}
                  </p>
                )}
              </div>

              {/* Organization Type */}
              <div>
                <label
                  htmlFor="organizationType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Clipboard size={16} />
                    <span>Organization Type</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="organizationType"
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.organizationType
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                  >
                    <option value="" disabled>
                      Select organization type
                    </option>
                    <option value="Government">Government</option>
                    <option value="NGO">NGO</option>
                    <option value="Private">Private</option>
                    <option value="Academic">Academic</option>
                    <option value="Research">Research</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                  </div>
                </div>
                {errors.organizationType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organizationType}
                  </p>
                )}
              </div>

              {/* Signed Date */}
              <div>
                <label
                  htmlFor="signedDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Signed Date</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="signedDate"
                  name="signedDate"
                  value={formData.signedDate}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.signedDate ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors`}
                />
                {errors.signedDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.signedDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>End Date</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>

              {/* Region */}
              <div>
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Region</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  placeholder="e.g. National, International, Eastern Africa"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.region ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.region && (
                  <p className="text-red-500 text-sm mt-1">{errors.region}</p>
                )}
              </div>

              {/* College */}
              <div>
                <label
                  htmlFor="college"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    <span>College</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.college ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                  >
                    <option value="" disabled>
                      Select college
                    </option>
                    <option value="College of Business and Economics">
                      College of Business and Economics
                    </option>
                    <option value="College of Social Science, Arts and Humanities">
                      College of Social Science, Arts and Humanities
                    </option>
                    <option value="College of Veterinary Medicine and Agriculture">
                      College of Veterinary Medicine and Agriculture
                    </option>
                    <option value="School of Law">School of Law</option>
                    <option value="College of Technology and Built Environment">
                      College of Technology and Built Environment
                    </option>
                    <option value="College of Natural and Computational Sciences">
                      College of Natural and Computational Sciences
                    </option>
                    <option value="College of Education and Language Studies">
                      College of Education and Language Studies
                    </option>
                    <option value="College of Health Science">
                      College of Health Science
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                  </div>
                </div>
                {errors.college && (
                  <p className="text-red-500 text-sm mt-1">{errors.college}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <ActivitySquare size={16} />
                    <span>Status</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                  </div>
                </div>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>Description</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of the partnership"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full p-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-md mb-4">
                <p className="text-gray-600 text-sm">
                  Contact information is optional but recommended for future
                  reference
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person */}
                <div>
                  <label
                    htmlFor="contactPerson"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Contact Person</span>
                      <span className="text-gray-500">(Optional)</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="e.g. Dr. John Smith"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>Contact Email</span>
                      <span className="text-gray-500">(Optional)</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    placeholder="e.g. john.smith@example.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                Add Partnership
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPartnership;
