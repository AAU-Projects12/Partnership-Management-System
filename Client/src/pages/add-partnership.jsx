import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

const AddPartnership = () => {
  // Form state
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    signedDate: '',
    endDate: '',
    region: '',
    college: '',
    status: 'Active',
    description: '',
    contactPerson: '',
    contactEmail: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    // For now, we'll just log it
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <NavBar />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Partnership Details</h1>
            <p className="text-gray-600 text-sm">Enter the details of the new partnership</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Organization Name */}
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  placeholder="e.g. World Health Organization"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Organization Type */}
              <div>
                <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                <div className="relative inline-block w-64">
                  <select
                    id="organizationType"
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select organization type</option>
                    <option value="Government">Government</option>
                    <option value="NGO">NGO</option>
                    <option value="Private">Private</option>
                    <option value="Academic">Academic</option>
                    <option value="Research">Research</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* Signed Date */}
              <div>
                <label htmlFor="signedDate" className="block text-sm font-medium text-gray-700 mb-1">Signed Date</label>
                <input
                  type="date"
                  id="signedDate"
                  name="signedDate"
                  value={formData.signedDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  required
                />
              </div>

              {/* Region */}
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  placeholder="e.g. National, International, Eastern Africa"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* College */}
              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">College</label>
                <div className="relative inline-block w-64">
                  <select
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select college</option>
                    <option value="College of Business and Economics">College of Business and Economics</option>
                    <option value="College of Social Science, Arts and Humanities">College of Social Science, Arts and Humanities</option>
                    <option value="College of Veterinary Medicine and Agriculture">College of Veterinary Medicine and Agriculture</option>
                    <option value="School of Law">School of Law</option>
                    <option value="College of Technology and Built Environment">College of Technology and Built Environment</option>
                    <option value="College of Natural and Computational Sciences">College of Natural and Computational Sciences</option>
                    <option value="College of Education and Language Studies">College of Education and Language Studies</option>
                    <option value="College of Health Science">College of Health Science</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative inline-block w-64">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of the partnership"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
              <div className="p-4 bg-gray-50 rounded-md mb-4">
                <p className="text-gray-600 text-sm">Contact information is optional but recommended for future reference</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person */}
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">Contact Person (Optional)</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="e.g. Dr. John Smith"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact Email (Optional)</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    placeholder="e.g. john.smith@example.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between mt-8">
              <Link to="/partnership" className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Add Partnership
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPartnership;