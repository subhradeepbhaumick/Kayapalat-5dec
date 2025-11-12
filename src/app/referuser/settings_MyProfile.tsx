'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ProfileData {
  name: string;
  profilePic: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  occupation: string;
  representativeId: string;
  password: string;
  confirmPassword: string;
}

const MyProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    profilePic: null,
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    occupation: '',
    representativeId: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, profilePic: fileURL }));
    }
  };

  const handleSave = () => {
    // Validation: Check if all required fields are filled
    if (!formData.name || !formData.email || !formData.phone || !formData.whatsapp || !formData.address || !formData.occupation || !formData.representativeId || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Here you can add logic to save to backend or local storage
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-center text-[#295A47] mb-8">
        My Profile
      </h1>

      <div className="max-w-4xl ml-20 mr-20 bg-white shadow-md rounded-lg p-6 flex-1">
        {isEditing ? (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name<span className="text-red-500">*</span></label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Profile Picture (Optional)</label>
                <div className="flex items-center space-x-4">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-25 h-25 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* Custom upload button */}
                  <div>
                    <input
                      id="profilePic"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" // Hide default file input
                    />
                    <label
                      htmlFor="profilePic"
                      className="cursor-pointer bg-[#295A47] text-white px-4 py-2 rounded-md hover:bg-[#1e3d32] transition"
                    >
                      Upload Photo
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email<span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number<span className="text-red-500">*</span></label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">WhatsApp Number<span className="text-red-500">*</span></label>
                <input
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your WhatsApp number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Occupation<span className="text-red-500">*</span></label>
                <input
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your occupation"
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">Address<span className="text-red-500">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your address"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Representative Id<span className="text-red-500">*</span></label>
                <input
                  name="representativeId"
                  type="text"
                  value={formData.representativeId}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter your Representative ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password<span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 pr-10"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm Password<span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-8">
              {formData.profilePic ? (
                <img src={formData.profilePic} alt="Profile" className="w-35 h-35 rounded-full" />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className=" text-gray-500">
                    {formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'N/A'}
                  </span>
                </div>
              )}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <h2><strong>Name:</strong> {formData.name || 'N/A'}</h2>
              <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
              <p><strong>WhatsApp:</strong> {formData.whatsapp || 'N/A'}</p>
              <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
              <p><strong>Password:</strong> {'*'.repeat(formData.password.length) || 'N/A'}</p>
              <p><strong>Occupation:</strong> {formData.occupation || 'N/A'}</p>
              <p><strong>Representative ID:</strong> {formData.representativeId || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 flex justify-center">
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="bg-[#295A47] text-white px-6 py-2 rounded-md hover:bg-[#1e3d32] transition"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </footer>
    </div>
  );
};

export default MyProfilePage;
