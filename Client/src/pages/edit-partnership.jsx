// EditPartnership.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getPartnershipById, updatePartnership } from "../api.jsx";
import toast from "react-hot-toast";
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  X,
} from "lucide-react";

const EditPartnership = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    partnerInstitution: {
      name: "",
      address: "",
      country: "",
      typeOfOrganization: "",
    },
    aauContact: {
      interestedCollegeOrDepartment: "",
    },
    partnerContactPerson: {
      name: "",
      institutionalEmail: "",
      phoneNumber: "",
      title: "",
      address: "",
    },
    partnerContactPersonSecondary: {
      name: "",
      institutionalEmail: "",
      phoneNumber: "",
      title: "",
      address: "",
    },
    aauContactPerson: {
      name: "",
      institutionalEmail: "",
      phoneNumber: "",
      title: "",
      address: "",
    },
    aauContactPersonSecondary: {
      name: "",
      institutionalEmail: "",
      phoneNumber: "",
      title: "",
      address: "",
    },
    potentialAreasOfCollaboration: [],
    otherCollaborationArea: "",
    potentialStartDate: "",
    durationOfPartnership: "",
    description: "",
    mouFileUrl: "",
    status: "",
  });

  useEffect(() => {
    const fetchPartnership = async () => {
      try {
        const { data } = await getPartnershipById(id);
        const formattedData = {
          partnerInstitution: {
            name: data.partnerInstitution?.name || "",
            address: data.partnerInstitution?.address || "",
            country: data.partnerInstitution?.country || "",
            typeOfOrganization:
              data.partnerInstitution?.typeOfOrganization || "",
          },
          aauContact: {
            interestedCollegeOrDepartment:
              data.aauContact?.interestedCollegeOrDepartment || "",
          },
          partnerContactPerson: {
            name: data.partnerContactPerson?.name || "",
            institutionalEmail:
              data.partnerContactPerson?.institutionalEmail || "",
            phoneNumber: data.partnerContactPerson?.phoneNumber || "",
            title: data.partnerContactPerson?.title || "",
            address: data.partnerContactPerson?.address || "",
          },
          partnerContactPersonSecondary: {
            name: data.partnerContactPersonSecondary?.name || "",
            institutionalEmail:
              data.partnerContactPersonSecondary?.institutionalEmail || "",
            phoneNumber: data.partnerContactPersonSecondary?.phoneNumber || "",
            title: data.partnerContactPersonSecondary?.title || "",
            address: data.partnerContactPersonSecondary?.address || "",
          },
          aauContactPerson: {
            name: data.aauContactPerson?.name || "",
            institutionalEmail: data.aauContactPerson?.institutionalEmail || "",
            phoneNumber: data.aauContactPerson?.phoneNumber || "",
            title: data.aauContactPerson?.title || "",
            address: data.aauContactPerson?.address || "",
          },
          aauContactPersonSecondary: {
            name: data.aauContactPersonSecondary?.name || "",
            institutionalEmail:
              data.aauContactPersonSecondary?.institutionalEmail || "",
            phoneNumber: data.aauContactPersonSecondary?.phoneNumber || "",
            title: data.aauContactPersonSecondary?.title || "",
            address: data.aauContactPersonSecondary?.address || "",
          },
          potentialAreasOfCollaboration:
            data.potentialAreasOfCollaboration || [],
          otherCollaborationArea: data.otherCollaborationArea || "",
          potentialStartDate: data.potentialStartDate
            ? new Date(data.potentialStartDate).toISOString().split("T")[0]
            : "",
          durationOfPartnership: data.durationOfPartnership || "",
          description: data.description || "",
          mouFileUrl: data.mouFileUrl || "",
          status: data.status || "",
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message;
        setError(errorMessage);
        toast.error("Failed to load partnership details: " + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPartnership();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCollaborationChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newAreas = checked
        ? [...prev.potentialAreasOfCollaboration, value]
        : prev.potentialAreasOfCollaboration.filter((area) => area !== value);
      return {
        ...prev,
        potentialAreasOfCollaboration: newAreas,
      };
    });
  };

  const getChangedFields = () => {
    const changes = {};
    const compareObjects = (obj1, obj2, path = "") => {
      for (const key in obj1) {
        const currentPath = path ? `${path}.${key}` : key;
        if (
          typeof obj1[key] === "object" &&
          obj1[key] !== null &&
          !Array.isArray(obj1[key])
        ) {
          compareObjects(obj1[key], obj2[key], currentPath);
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          if (currentPath.includes(".")) {
            const [section, field] = currentPath.split(".");
            if (!changes[section]) changes[section] = {};
            changes[section][field] = obj1[key];
          } else {
            changes[key] = obj1[key];
          }
        }
      }
    };
    compareObjects(formData, originalData);
    // Ensure partnerInstitution includes all required fields if any are changed
    if (changes.partnerInstitution) {
      changes.partnerInstitution = {
        name: formData.partnerInstitution.name,
        address: formData.partnerInstitution.address,
        country: formData.partnerInstitution.country,
        typeOfOrganization: formData.partnerInstitution.typeOfOrganization,
      };
    }
    return changes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Client-side validation
    const changedFields = getChangedFields();
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes to save");
      setSubmitting(false);
      return;
    }

    // Validate mandatory fields if they are being updated
    if (changedFields.partnerInstitution) {
      if (!changedFields.partnerInstitution.name) {
        setError("Partner institution name is required");
        setSubmitting(false);
        return;
      }
      if (!changedFields.partnerInstitution.address) {
        setError("Partner institution address is required");
        setSubmitting(false);
        return;
      }
      if (!changedFields.partnerInstitution.country) {
        setError("Partner institution country is required");
        setSubmitting(false);
        return;
      }
      if (!changedFields.partnerInstitution.typeOfOrganization) {
        setError("Partner institution type of organization is required");
        setSubmitting(false);
        return;
      }
    }
    if (
      changedFields.aauContact &&
      !changedFields.aauContact.interestedCollegeOrDepartment
    ) {
      setError("AAU department is required");
      setSubmitting(false);
      return;
    }
    if (changedFields.partnerContactPerson) {
      if (!changedFields.partnerContactPerson.name) {
        setError("Partner contact person name is required");
        setSubmitting(false);
        return;
      }
      if (
        !changedFields.partnerContactPerson.institutionalEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          changedFields.partnerContactPerson.institutionalEmail
        )
      ) {
        setError("Valid partner contact email is required");
        setSubmitting(false);
        return;
      }
      if (!changedFields.partnerContactPerson.phoneNumber) {
        setError("Partner contact phone number is required");
        setSubmitting(false);
        return;
      }
    }
    if (changedFields.aauContactPerson) {
      if (!changedFields.aauContactPerson.name) {
        setError("AAU contact person name is required");
        setSubmitting(false);
        return;
      }
      if (
        !changedFields.aauContactPerson.institutionalEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          changedFields.aauContactPerson.institutionalEmail
        )
      ) {
        setError("Valid AAU contact email is required");
        setSubmitting(false);
        return;
      }
      if (!changedFields.aauContactPerson.phoneNumber) {
        setError("AAU contact phone number is required");
        setSubmitting(false);
        return;
      }
    }
    if (
      changedFields.potentialStartDate &&
      !/^\d{4}-\d{2}-\d{2}$/.test(changedFields.potentialStartDate)
    ) {
      setError("Valid potential start date is required (YYYY-MM-DD)");
      setSubmitting(false);
      return;
    }
    if (
      changedFields.durationOfPartnership &&
      !changedFields.durationOfPartnership
    ) {
      setError("Duration of partnership is required");
      setSubmitting(false);
      return;
    }
    if (
      changedFields.potentialAreasOfCollaboration &&
      changedFields.potentialAreasOfCollaboration.includes("Other") &&
      !changedFields.otherCollaborationArea
    ) {
      setError(
        "Other collaboration description is required when 'Other' is selected"
      );
      setSubmitting(false);
      return;
    }
    if (
      changedFields.status &&
      !["Active", "Rejected", "Pending"].includes(changedFields.status)
    ) {
      setError("Status must be Active, Rejected, or Pending");
      setSubmitting(false);
      return;
    }

    try {
      await updatePartnership(id, changedFields);
      toast.success("Partnership updated successfully");
      navigate("/partnership");
    } catch (err) {
      const errorMessage =
        err.response?.data?.errors?.map((e) => e.msg).join(", ") ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update partnership";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Partnership
            </h1>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/partnership")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Partner Institution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Partner Institution
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="partnerInstitution.name"
                    value={formData.partnerInstitution.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type of Organization <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="partnerInstitution.typeOfOrganization"
                    value={formData.partnerInstitution.typeOfOrganization}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="University">University</option>
                    <option value="NGO">NGO</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="partnerInstitution.address"
                    value={formData.partnerInstitution.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="partnerInstitution.country"
                    value={formData.partnerInstitution.country}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* AAU Contact */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                AAU Contact
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aauContact.interestedCollegeOrDepartment"
                    value={formData.aauContact.interestedCollegeOrDepartment}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* AAU Contact Person */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                AAU Contact Person
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aauContactPerson.name"
                    value={formData.aauContactPerson.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="aauContactPerson.title"
                    value={formData.aauContactPerson.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="aauContactPerson.institutionalEmail"
                    value={formData.aauContactPerson.institutionalEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="aauContactPerson.phoneNumber"
                    value={formData.aauContactPerson.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="aauContactPerson.address"
                    value={formData.aauContactPerson.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Partner Contact Person */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Partner Contact Person
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="partnerContactPerson.name"
                    value={formData.partnerContactPerson.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="partnerContactPerson.title"
                    value={formData.partnerContactPerson.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="partnerContactPerson.institutionalEmail"
                    value={formData.partnerContactPerson.institutionalEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="partnerContactPerson.phoneNumber"
                    value={formData.partnerContactPerson.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="partnerContactPerson.address"
                    value={formData.partnerContactPerson.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Partner Contact Person */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Secondary Partner Contact Person (Optional)
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="partnerContactPersonSecondary.name"
                    value={formData.partnerContactPersonSecondary.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="partnerContactPersonSecondary.title"
                    value={formData.partnerContactPersonSecondary.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="partnerContactPersonSecondary.institutionalEmail"
                    value={
                      formData.partnerContactPersonSecondary.institutionalEmail
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="partnerContactPersonSecondary.phoneNumber"
                    value={formData.partnerContactPersonSecondary.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="partnerContactPersonSecondary.address"
                    value={formData.partnerContactPersonSecondary.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Secondary AAU Contact Person */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Secondary AAU Contact Person (Optional)
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="aauContactPersonSecondary.name"
                    value={formData.aauContactPersonSecondary.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="aauContactPersonSecondary.title"
                    value={formData.aauContactPersonSecondary.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="aauContactPersonSecondary.institutionalEmail"
                    value={
                      formData.aauContactPersonSecondary.institutionalEmail
                    }
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="aauContactPersonSecondary.phoneNumber"
                    value={formData.aauContactPersonSecondary.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="aauContactPersonSecondary.address"
                    value={formData.aauContactPersonSecondary.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Collaboration Areas */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Collaboration Areas
              </h2>
              <div className="space-y-2">
                {[
                  "Research",
                  "Student Exchange",
                  "Faculty Exchange",
                  "Other",
                ].map((area) => (
                  <label key={area} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={area}
                      checked={formData.potentialAreasOfCollaboration.includes(
                        area
                      )}
                      onChange={handleCollaborationChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{area}</span>
                  </label>
                ))}
                {formData.potentialAreasOfCollaboration.includes("Other") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Other Collaboration Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="otherCollaborationArea"
                      value={formData.otherCollaborationArea}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dates and Duration */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Dates and Duration
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Potential Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="potentialStartDate"
                    value={formData.potentialStartDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration of Partnership{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="durationOfPartnership"
                    value={formData.durationOfPartnership}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    MOU File URL
                  </label>
                  <input
                    type="url"
                    name="mouFileUrl"
                    value={formData.mouFileUrl}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPartnership;
