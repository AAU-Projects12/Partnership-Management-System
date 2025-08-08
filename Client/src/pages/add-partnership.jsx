import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { createPartnership } from "../api.jsx";
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
  Phone,
  Link,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddPartnership() {
  const DRAFT_KEY = "addPartnershipDraft";
  const initialFormData = {
    name: "",
    type: "",
    signedDate: "",
    endDate: "",
    region: "",
    country: "",
    college: "",
    schoolDepartmentUnit: "",
    status: "",
    description: "",
    mouFileUrl: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactTitle: "",
    aauContactName: "",
    aauContactEmail: "",
    aauContactPhone: "",
    aauContactCollege: "",
    aauContactSchoolDepartmentUnit: "",
    objectives: [],
    scope: "",
    otherCollaborationArea: "",
    deliverables: [""],
    fundingAmount: "",
    reportingRequirements: "",
  };

  // Initialize formData from localStorage if present
  const [formData, setFormData] = useState(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        // Ensure fundingAmount is a string for the new logic
        if (parsed.fundingAmount) {
          parsed.fundingAmount = String(parsed.fundingAmount);
        }
        return parsed;
      } catch { }
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save draft to localStorage on every formData change
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errorMsg = "";
    // All fields that are required by the backend
    const requiredFields = [
      "name",
      "type",
      "signedDate",
      "endDate",
      "region",
      "country",
      "college",
      "aauContactName",
      "aauContactEmail",
      "aauContactPhone",
      "aauContactCollege",
      "aauContactSchoolDepartmentUnit",
    ];

    if (requiredFields.includes(name) && !String(value).trim()) {
      // Creates a user-friendly field name like "Signed Date" from "signedDate"
      const fieldName =
        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1");
      errorMsg = `${fieldName} is required.`;
    } else if (
      (name === "contactEmail" || name === "aauContactEmail") &&
      value &&
      !/\S+@\S+\.\S+/.test(String(value))
    ) {
      errorMsg = "Invalid email format.";
    } else if (name === "fundingAmount" && value && isNaN(Number(value))) {
      errorMsg = "Funding amount must be a number.";
    } else if (name === "fundingAmount" && value && Number(value) < 0) {
      errorMsg = "Funding amount cannot be negative.";
    }


    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };


  const formatNumber = (numStr) => {
    if (numStr === null || numStr === undefined || numStr === "") return "";
    const [integerPart, decimalPart] = String(numStr).split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    let result = formattedIntegerPart;
    if (decimalPart !== undefined) {
      result += `.${decimalPart}`;
    }
    return result;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "fundingAmount") {
      const cleanValue = value.replace(/[^0-9.]/g, ''); 

      if ((cleanValue.match(/\./g) || []).length > 1) {
        return;
      }

      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
      validateField(name, cleanValue);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const optionalFields = [
      "status",
      "contactPerson",
      "contactPhone",
      "contactTitle",
      "contactAddress", // Now optional
      "description",
      "scope",
      "reportingRequirements",
    ];

    if (optionalFields.includes(name) && !value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [name]: "N/A",
      }));
    }
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

  const handleArrayBlur = (e, index, fieldName) => {
    const { value } = e.target;
    if (!value.trim() && fieldName === "deliverables") {
      const updatedArray = [...formData[fieldName]];
      updatedArray[index] = "N/A";
      setFormData((prev) => ({
        ...prev,
        [fieldName]: updatedArray,
      }));
    }
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
      [fieldName]: updatedArray.length > 0 ? updatedArray : [""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    let formIsValid = true;
    for (const [key, value] of Object.entries(formData)) {
      if (!Array.isArray(value)) {
        if (!validateField(key, value)) {
          formIsValid = false;
        }
      }
    }

    if (!formIsValid) {
      toast.error("Please correct the errors in the form.");
      setIsSubmitting(false);
      return;
    }

    const e164Regex = /^\+\d{10,15}$/;
    if (
      formData.contactPhone &&
      formData.contactPhone !== "N/A" &&
      !e164Regex.test(formData.contactPhone)
    ) {
      setErrors((prev) => ({
        ...prev,
        contactPhone: "Phone must be in E.164 format (e.g. +251911234567)",
      }));
      formIsValid = false;
    }
    if (formData.aauContactPhone && !e164Regex.test(formData.aauContactPhone)) {
      setErrors((prev) => ({
        ...prev,
        aauContactPhone: "Phone must be in E.164 format (e.g. +251911234567)",
      }));
      formIsValid = false;
    }

    if (!formIsValid) {
      toast.error("Please correct the validation errors.");
      setIsSubmitting(false);
      return;
    }
    const getSanitizedValue = (value) =>
      String(value).trim() === "" ? "N/A" : value;

    const payload = {
      partnerInstitution: {
        name: formData.name,
        address: formData.region,
        country: formData.country,
        typeOfOrganization: formData.type,
      },
      aauContact: {
        interestedCollegeOrDepartment: formData.college,
      },
      potentialAreasOfCollaboration: formData.objectives,
      otherCollaborationArea: formData.objectives.includes("Other")
        ? formData.otherCollaborationArea?.trim() || ""
        : undefined,
      potentialStartDate: formData.signedDate,
      durationOfPartnership: formData.endDate,
      fundingAmount: Number(formData.fundingAmount) || 0, // Ensure it's a number
      partnerContactPerson: {
        name: getSanitizedValue(formData.contactPerson),
        title: getSanitizedValue(formData.contactTitle),
        institutionalEmail: formData.contactEmail || "N/A",
        phoneNumber: getSanitizedValue(formData.contactPhone),
        address: getSanitizedValue(formData.contactAddress), // Now sanitized
      },
      aauContactPerson: {
        name: formData.aauContactName,
        college: formData.aauContactCollege,
        schoolDepartmentUnit: formData.aauContactSchoolDepartmentUnit,
        institutionalEmail: formData.aauContactEmail,
        phoneNumber: formData.aauContactPhone,
      },
      description: getSanitizedValue(formData.description),
      status: getSanitizedValue(formData.status),
      reportingRequirements: getSanitizedValue(formData.reportingRequirements),
      scope: getSanitizedValue(formData.scope),
      deliverables: formData.deliverables
        .map((d) => getSanitizedValue(d))
        .filter((d) => d !== ""),
      ...(formData.mouFileUrl && { mouFileUrl: formData.mouFileUrl.trim() }),
    };

    try {
      await createPartnership(payload);
      toast.success("Partnership created successfully!");
      navigate("/partnership");
      setFormData(initialFormData);
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error("Failed to create partnership:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to create partnership. Please try again.";
      toast.error(errorMsg);
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOfOrganizationOptions = [
    "Academic",
    "Research",
    "NGO",
    "INGO",
    "Government",
    "Private",
    "Academic and Research",
    "Government and Research",
    "NGO and Research",
    "Other",
  ];
  const durationOptions = [
    "1 year",
    "2 years",
    "3 years",
    "4 years",
    "5 years",
    "Above 5 years",
  ];
  const collegeOptions = [
    "All Colleges",
    "Central",
    "College of Business and Economics (CBE)",
    "College of Social Sciences, Arts and Humanities (CSSAH)",
    "College of Education and Language Studies (CELS)",
    "College of Veterinary Medicine & Agriculture (CVMA)",
    "College of Technology & Built Environment (CoTBE)",
    "College of Natural and Computational Sciences (CNCS)",
    "College of Health Sciences (CHS)",
    "School of Law (SoL)",
    "Institute of Water Environment & Climate Research (IWECR)",
    "Aklilu Lema Institute of Health Research (ALIHR)",
    "Institute of Geophysics Space Science & Astronomy (IGSSA)",
    "Institute for Social & Economic Research (ISER)",
    "Institute of Ethiopian Studies (IES)",
    "Institute of Advanced Science & Technology (IAST)",
    "Institute of Peace & Security (IPSS)",
  ];
  const collaborationOptions = [
    "Research/Technology Transfer",
    "Student/Staff/Researcher Mobility",
    "Funding Grant/Resource Mobilization",
    "Joint Courses/Programs",
    "University-Industry Linkage",
    "Consultancy",
    "Joint Training/Seminars/Workshops",
    "Other",
  ];
  const maxLengths = {
    name: 100,
    title: 100,
    email: 100,
    phone: 20,
    address: 200,
    department: 100,
    description: 500,
    institution: 200,
    country: 100,
  };
  const countryOptions = [
    "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, The Democratic Republic of the", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran, Islamic Republic of", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saint Barthélemy", "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <button
            type="button"
            className="mb-4 flex items-center text-[#004165] hover:underline"
            onClick={() => navigate("/partnership")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Partnerships
          </button>
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
                  className={`w-full p-2 border ${errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.institution}
                  required
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
                    className={`w-full p-2 border ${errors.type ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                    required
                  >
                    <option value="" disabled>
                      Select partnership type
                    </option>
                    {typeOfOrganizationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                  required
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
                    <span>Duration</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.endDate ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                    required
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                )}
              </div>

              {/* UPDATED Funding Amount */}
              <div>
                <label
                  htmlFor="fundingAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>Funding Amount</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  id="fundingAmount"
                  name="fundingAmount"
                  placeholder="e.g. 10,000"
                  value={formatNumber(formData.fundingAmount)}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.fundingAmount ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  required
                />
                {errors.fundingAmount && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fundingAmount}
                  </p>
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
                  className={`w-full p-2 border ${errors.region ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.address}
                  required
                />
                {errors.region && (
                  <p className="text-red-500 text-xs mt-1">{errors.region}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span>Partner Country</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.country ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                    required
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    {countryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
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
                    <span>College/Institution</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.college ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                    maxLength={maxLengths.department}
                    required
                  >
                    <option value="" disabled>
                      Select college
                    </option>
                    {collegeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
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

              {/* Partner Institution Contact Details Section */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                  <ActivitySquare size={28} className="text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      Partner Institution Contact Details
                    </h3>
                    <p className="text-sm text-blue-700">
                      Provide the contact information for the partner
                      institution.
                    </p>
                  </div>
                </div>
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
                  </div>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <label
                  htmlFor="contactPerson"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Partner Contact Person</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="e.g. Dr. Jane Doe"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border ${errors.contactPerson ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.name}
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Partner Contact Email</span>
                  </div>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="e.g. jane.doe@example.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.contactEmail ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.email}
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Partner Contact Phone */}
              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>Partner Contact Phone</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="+251911234567"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border ${errors.contactPhone ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.phone}
                />
                {errors.contactPhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactPhone}
                  </p>
                )}
              </div>

              {/* Partner Contact Title */}
              <div>
                <label
                  htmlFor="contactTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Partner Contact Person Title</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="contactTitle"
                  name="contactTitle"
                  placeholder="e.g., Project Manager"
                  value={formData.contactTitle}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border ${errors.contactTitle ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.title}
                />
                {errors.contactTitle && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactTitle}
                  </p>
                )}
              </div>

              {/* Partner Contact Address */}
              <div>
                <label
                  htmlFor="contactAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Partner Contact Person Address</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="contactAddress"
                  name="contactAddress"
                  placeholder="e.g., 123 Innovation Dr, Addis Ababa"
                  value={formData.contactAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-2 border ${errors.contactAddress ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.address}
                />
                {errors.contactAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactAddress}
                  </p>
                )}
              </div>

              {/* AAU Contact Details Section */}
              <div className="col-span-1 md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                  <GraduationCap size={28} className="text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      AAU Contact Details
                    </h3>
                    <p className="text-sm text-blue-700">
                      Please provide the main AAU contact information for this
                      partnership.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="aauContactName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>AAU Contact Name</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="aauContactName"
                  name="aauContactName"
                  placeholder="e.g., Prof. John Smith"
                  value={formData.aauContactName}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.aauContactName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.name}
                  required
                />
                {errors.aauContactName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.aauContactName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="aauContactEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>AAU Contact Email</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="email"
                  id="aauContactEmail"
                  name="aauContactEmail"
                  placeholder="e.g., john.smith@aau.edu.et"
                  value={formData.aauContactEmail}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.aauContactEmail
                    ? "border-red-500"
                    : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.email}
                  required
                />
                {errors.aauContactEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.aauContactEmail}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="aauContactPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>AAU Contact Phone</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="aauContactPhone"
                  name="aauContactPhone"
                  placeholder="+251912345678"
                  value={formData.aauContactPhone}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.aauContactPhone
                    ? "border-red-500"
                    : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.phone}
                  required
                />
                {errors.aauContactPhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.aauContactPhone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="aauContactCollege"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    <span>AAU Contact College</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="aauContactCollege"
                    name="aauContactCollege"
                    value={formData.aauContactCollege}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.aauContactCollege
                      ? "border-red-500"
                      : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-colors`}
                    required
                  >
                    <option value="" disabled>
                      Select college
                    </option>
                    {collegeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
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
                {errors.aauContactCollege && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.aauContactCollege}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="aauContactSchoolDepartmentUnit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} />
                    <span>AAU Contact School/Dept/Unit</span>
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  id="aauContactSchoolDepartmentUnit"
                  name="aauContactSchoolDepartmentUnit"
                  placeholder="e.g., School of Information Science"
                  value={formData.aauContactSchoolDepartmentUnit}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.aauContactSchoolDepartmentUnit
                    ? "border-red-500"
                    : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  maxLength={maxLengths.department}
                  required
                />
                {errors.aauContactSchoolDepartmentUnit && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.aauContactSchoolDepartmentUnit}
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
                </div>
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Detailed description of the partnership..."
                value={formData.description}
                maxLength={maxLengths.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 border ${errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Potential Areas of Collaboration (Objectives) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <ListChecks size={16} />
                  <span>Potential Areas of Collaboration</span>
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {collaborationOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center px-3 py-1 rounded-full border cursor-pointer transition-colors ${formData.objectives.includes(option)
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700"
                      }`}
                  >
                    <input
                      type="checkbox"
                      name="objectives"
                      value={option}
                      checked={formData.objectives.includes(option)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          objectives: checked
                            ? [...prev.objectives, option]
                            : prev.objectives.filter((obj) => obj !== option),
                        }));
                        setErrors((prev) => ({ ...prev, objectives: "" }));
                      }}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {/* Show input for 'Other' if checked */}
              {formData.objectives.includes("Other") && (
                <div className="mt-3">
                  <input
                    type="text"
                    name="otherCollaborationArea"
                    value={formData.otherCollaborationArea}
                    onChange={handleChange}
                    placeholder="Please specify other area of collaboration..."
                    className="w-full p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    required
                  />
                </div>
              )}
              {errors.objectives && (
                <p className="text-red-500 text-xs mt-1">{errors.objectives}</p>
              )}
            </div>

            {/* Scope */}
            <div className="mb-6">
              <label
                htmlFor="scope"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  <span>Scope</span>
                </div>
              </label>
              <textarea
                id="scope"
                name="scope"
                rows="3"
                placeholder="Define the scope of the partnership..."
                value={formData.scope}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 border ${errors.scope ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              ></textarea>
              {errors.scope && (
                <p className="text-red-500 text-xs mt-1">{errors.scope}</p>
              )}
            </div>

            {/* Reporting Requirements */}
            <div className="mb-6">
              <label
                htmlFor="reportingRequirements"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <div className="flex items-center gap-2">
                  <FileSignature size={16} />
                  <span>Reporting Requirements</span>
                </div>
              </label>
              <textarea
                id="reportingRequirements"
                name="reportingRequirements"
                rows="3"
                placeholder="Detail any reporting requirements..."
                value={formData.reportingRequirements}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 border ${errors.reportingRequirements
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

            {/* Deliverables */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <ListChecks size={16} />
                  <span>Deliverables</span>
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
                    onBlur={(e) => handleArrayBlur(e, index, "deliverables")}
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
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Partnership Document
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Google Drive Document Link
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      <Link className="h-5 w-5" />
                    </span>
                    <input
                      type="url"
                      name="mouFileUrl"
                      value={formData.mouFileUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, mouFileUrl: e.target.value })
                      }
                      placeholder="https://drive.google.com/..."
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Paste the Google Drive link to your partnership document
                    (MOU)
                  </p>
                </div>
              </div>
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