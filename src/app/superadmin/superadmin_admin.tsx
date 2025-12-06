

'use client';
import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';

interface Admin {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
}

const SuperAdmin_Admin = () => {

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string>('All');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    password: '',
    profilePic: null as File | null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  // Fetch admins from DB on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('/api/superadmin/admin_page');
        const data = await res.json();
        if (res.ok) {
          // Use actual profile_pic from DB, fallback to placeholder
          const adminsWithPic = data.admins.map((a: any) => ({
            ...a,
            profilePic: a.profile_pic || '/placeholder_person.jpg',
          }));
          setAdmins(adminsWithPic);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdmins();
  }, []);

  const uniqueAdmins = Array.from(new Set(admins.map(a => a.name)));

  const filteredAdmins = admins.filter(
    (admin) => selectedAdmin === 'All' || admin.name === selectedAdmin
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate fields
    if (name === 'email') {
      if (!value.includes('@')) {
        setErrors(prev => ({ ...prev, email: 'Email must contain @' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } else if (name === 'phone') {
      if (value && value.length !== 10) {
        setErrors(prev => ({ ...prev, phone: 'Phone must be 10 digits' }));
      } else {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setFormData({ ...formData, profilePic: file });
    }
  };

  const submitAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Name and Email are required');
      return;
    }
    if (errors.email || errors.phone) {
      alert('Please fix the validation errors');
      return;
    }
    if (!isEditing && !formData.password) {
      alert('Password is required for new admins');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('whatsapp', formData.whatsapp);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('password', formData.password);
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }
      if (isEditing) {
        formDataToSend.append('user_id', editingAdmin?.user_id || '');
      }

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch('/api/superadmin/admin_page', {
        method,
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        if (isEditing) {
          // Update local state for edit
          setAdmins(prev => prev.map(a => a.user_id === editingAdmin?.user_id ? {
            ...a,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          } : a));
        } else {
          // Add new admin to local state
          setAdmins(prev => [...prev, {
            user_id: data.user_id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            profilePic: '/default-profile.png'
          }]);
        }
        resetForm();
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const handleEditClick = (admin: Admin, e: React.MouseEvent) => {
    setIsEditing(true);
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      whatsapp: '',
      address: '',
      password: '',
      profilePic: null, // Can't prefill file input
    });
    setShowAddPopup(true);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', whatsapp: '', address: '', password: '', profilePic: null });
    setSelectedFile(null);
    setPreview(null);
    setIsEditing(false);
    setEditingAdmin(null);
    setShowAddPopup(false);
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">Admin Management</h1>
        <p className="text-gray-600 text-lg">Manage your super admins, admins, and moderators.</p>
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Select Admin</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600"
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
          >
            <option key="All" value="All">All</option>
            {uniqueAdmins.map((adminName, index) => (
              <option key={index} value={adminName}>{adminName}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button className="bg-green-900 text-white px-3 py-1 mr-7 rounded-md hover:bg-green-700" onClick={() => {
            setFormData({
              name: '',
              email: '',
              phone: '',
              whatsapp: '',
              address: '',
              password: '',
              profilePic: null,
            });
            setSelectedFile(null);
            setPreview(null);
            setIsEditing(false);
            setEditingAdmin(null);
            setShowAddPopup(true);
          }}>Add</button>
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={() => alert('Edit coming soon')}>Edit</button> */}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-[#D7E7D0] text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Rep. Id</th>
              <th className="px-4 py-2 border">Profile</th>
              <th className="px-4 py-2 border">Admin Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? filteredAdmins.map((admin, index) => (
              <tr key={admin.user_id} className="hover:bg-green-50 transition">
                <td className="px-4 py-2 border text-center">{admin.user_id}</td>
                <td className="px-4 py-2 border text-center">
                  <img src={admin.profilePic} className="w-10 h-10 rounded-full mx-auto" />
                </td>
                <td className="px-4 py-2 border">{admin.name}</td>
                <td className="px-4 py-2 border">{admin.email}</td>
                <td className="px-4 py-2 border">{admin.phone}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-gray-500"
                    onClick={(e) => handleEditClick(admin, e)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 border">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={() => setShowAddPopup(false)}>
              <X size={22} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Add New Admin</h2>

            <form onSubmit={submitAdmin} encType="multipart/form-data" className="space-y-3">
              <input name="name" placeholder="Name" className="w-full border p-2 rounded" onChange={handleInputChange} value={formData.name} />
              <div>
                <input name="email" placeholder="Email" className="w-full border p-2 rounded" onChange={handleInputChange} value={formData.email} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div>
                <input name="phone" placeholder="Phone" className="w-full border p-2 rounded" onChange={handleInputChange} value={formData.phone} />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <input name="whatsapp" placeholder="WhatsApp" className="w-full border p-2 rounded" onChange={handleInputChange} value={formData.whatsapp} />
              <input name="address" placeholder="Address" className="w-full border p-2 rounded" onChange={handleInputChange} value={formData.address} />
              <div className="flex items-center space-x-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div>
                  <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="profilePic"
                    className="cursor-pointer bg-[#295A47] text-white px-4 py-2 rounded-md hover:bg-[#1e3d32] transition"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>
              <input name="password" type="password" placeholder={isEditing ? "New Password (optional)" : "Password"} className="w-full border p-2 rounded" onChange={handleInputChange} value={formData.password} />

              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md mt-3 hover:bg-green-700">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin_Admin;
