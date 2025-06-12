import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { createPartnership } from "../api";
import toast from "react-hot-toast";
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
  ListChecks,
  Target,
  DollarSign,
  FileSignature,
  PlusCircle,
  XCircle,
} from "lucide-react";

function AddPartnership() {
  const initialFormData = {
    name: "",
    type: "",
    signedDate: "",
    endDate: "",
    region: "",
    college: "",
    status: "Active",
    description: "",
    contactPerson: "",
    contactEmail: "",
    objectives: [""], // Initialize with one empty string for the first input
    scope: "",
    deliverables: [""], // Initialize with one empty string
    fundingAmount: "",
    reportingRequirements: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = "";
    const requiredFields = [
      "name",
      "type",
      "signedDate",
      "endDate",
      "region",
      "college",
      "status",
      "description",
    ];

    if (requiredFields.includes(name) && !String(value).trim()) {
      errorMsg = `${
        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1")
      } is required.`;
    } else if (
      name === "contactEmail" &&
      value &&
      !/\S+@\S+\.\S+/.test(String(value))
    ) {
      errorMsg = "Invalid email format.";
    } else if (name === "fundingAmount" && value && isNaN(Number(value))) {
      errorMsg = "Funding amount must be a number.";
    } else if (
      name === "endDate" &&
      formData.signedDate &&
      String(value) < formData.signedDate
    ) {
      errorMsg = "End date cannot be earlier than signed date.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleArrayChange = (e, index, fieldName) => {
    const { value } = e.target;
    const updatedArray = [...formData[fieldName]];
    updatedArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: updatedArray,
    }));
  };

  const addArrayItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""],
    }));
  };

  const removeArrayItem = (index, fieldName) => {
    const updatedArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: updatedArray.length > 0 ? updatedArray : [""], // Ensure at least one input if all are removed
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    let formIsValid = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // For arrays like objectives and deliverables, we will filter empty strings later.
        // Validation for array items (e.g., if they are required or have specific formats) can be added here if needed.
        // For now, we assume empty strings in arrays are permissible for optional fields and will be filtered out before submission.
      } else {
        if (!validateField(key, String(value))) {
          formIsValid = false;
        }
      }
    });

    if (!formIsValid) {
      toast.error("Please correct the errors in the form.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      objectives: formData.objectives.filter((obj) => obj.trim() !== ""),
      deliverables: formData.deliverables.filter((del) => del.trim() !== ""),
      fundingAmount: formData.fundingAmount
        ? Number(formData.fundingAmount)
        : undefined,
    };

    Object.keys(payload).forEach((key) => {
      if (
        payload[key] === "" ||
        (Array.isArray(payload[key]) && payload[key].length === 0)
      ) {
        // Do not delete required fields even if they are empty string at this stage,
        // as validateField would have already caught them.
        // This is more for optional fields that are truly empty.
        const requiredFieldsForPayload = [
          "name",
          "type",
          "signedDate",
          "endDate",
          "region",
          "college",
          "status",
          "description",
        ];
        if (!requiredFieldsForPayload.includes(key)) {
          delete payload[key];
        }
      }
    });

    try {
      await createPartnership(payload);
      toast.success("Partnership created successfully!");
      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Failed to create partnership:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to create partnership. Please try again.";
      toast.error(errorMsg);
      if (error.response?.data?.errors) {
        // Assuming backend errors are an object mapping field names to error messages
        const backendErrors = {};
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          backendErrors[key] = Array.isArray(value) ? value.join(", ") : value;
        }
        setErrors(backendErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Partnership
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Fill in the details to create a new partnership entry.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
              {/* Partnership Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>Partnership Name</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Collaborative Research Initiative"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Partnership Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Clipboard size={16} />
                    <span>Partnership Type</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full p-2 border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                  >
                    <option value="" disabled>
                      Select partnership type
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
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
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
                  <p className="text-red-500 text-xs mt-1">
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
                  <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
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
                  placeholder="e.g. National, Addis Ababa"
                  value={formData.region}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.region ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.region && (
                  <p className="text-red-500 text-xs mt-1">{errors.region}</p>
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
                  <p className="text-red-500 text-xs mt-1">{errors.college}</p>
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
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>

              {/* Contact Person (Optional) */}
              <div>
                <label
                  htmlFor="contactPerson"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Contact Person</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.contactPerson ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Contact Email (Optional) */}
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Contact Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="e.g. jane.doe@example.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.contactEmail ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Funding Amount (Optional) */}
              <div>
                <label
                  htmlFor="fundingAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>Funding Amount (Optional)</span>
                  </div>
                </label>
                <input
                  type="number"
                  id="fundingAmount"
                  name="fundingAmount"
                  placeholder="e.g. 50000"
                  value={formData.fundingAmount}
                  onChange={handleChange}
                  className={`w-full p-2 border ${
                    errors.fundingAmount ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {errors.fundingAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fundingAmount}
                  </p>
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
                rows="4"
                placeholder="Detailed description of the partnership..."
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Scope (Optional) */}
            <div className="mb-6">
              <label
                htmlFor="scope"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  <span>Scope (Optional)</span>
                </div>
              </label>
              <textarea
                id="scope"
                name="scope"
                rows="3"
                placeholder="Define the scope of the partnership..."
                value={formData.scope}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.scope ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              ></textarea>
              {errors.scope && (
                <p className="text-red-500 text-xs mt-1">{errors.scope}</p>
              )}
            </div>

            {/* Reporting Requirements (Optional) */}
            <div className="mb-6">
              <label
                htmlFor="reportingRequirements"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center gap-2">
                  <FileSignature size={16} />
                  <span>Reporting Requirements (Optional)</span>
                </div>
              </label>
              <textarea
                id="reportingRequirements"
                name="reportingRequirements"
                rows="3"
                placeholder="Detail any reporting requirements..."
                value={formData.reportingRequirements}
                onChange={handleChange}
                className={`w-full p-2 border ${
                  errors.reportingRequirements
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              ></textarea>
              {errors.reportingRequirements && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.reportingRequirements}
                </p>
              )}
            </div>

            {/* Objectives (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <ListChecks size={16} />
                  <span>Objectives (Optional)</span>
                </div>
              </label>
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Objective ${index + 1}`}
                    value={objective}
                    onChange={(e) => handleArrayChange(e, index, "objectives")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "objectives")}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove objective"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("objectives")}
                className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                <PlusCircle size={16} />
                Add Objective
              </button>
              {errors.objectives && (
                <p className="text-red-500 text-xs mt-1">{errors.objectives}</p>
              )}
            </div>

            {/* Deliverables (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <ListChecks size={16} />{" "}
                  {/* Consider a different icon if ListChecks is already used */}
                  <span>Deliverables (Optional)</span>
                </div>
              </label>
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Deliverable ${index + 1}`}
                    value={deliverable}
                    onChange={(e) =>
                      handleArrayChange(e, index, "deliverables")
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "deliverables")}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remove deliverable"
                    >
                      <XCircle size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("deliverables")}
                className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                <PlusCircle size={16} />
                Add Deliverable
              </button>
              {errors.deliverables && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.deliverables}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Add Partnership"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPartnership;
