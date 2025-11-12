'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
}

const SuperAdmin_Admin = () => {
  const router = useRouter();

  // Dummy data
  const [admins] = useState<Admin[]>([
    {
      id: 1,
      name: 'Ragini Sarkar',
      email: 'ragini@kayapalat.com',
      phone: '9876543210',
      profilePic: '/Screenshot 2025-11-07 174332.png',
    },
    {
      id: 2,
      name: 'Anirban Dey',
      email: 'anirban@kayapalat.com',
      phone: '9876512345',
      profilePic: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      id: 3,
      name: 'Sohini Mukherjee',
      email: 'sohini@kayapalat.com',
      phone: '9867891234',
      profilePic: 'https://randomuser.me/api/portraits/women/40.jpg',
    },
  ]);

  const uniqueAdmins = Array.from(new Set(admins.map((a) => a.name)));
  const [selectedAdmin, setSelectedAdmin] = useState<string>('All');

  const filteredAdmins = admins.filter(
    (admin) => selectedAdmin === 'All' || admin.name === selectedAdmin
  );

  // ✅ Navigate to selected admin’s dashboard
  const handleRowClick = (admin: Admin) => {
    // Save the previous route to session storage (so we know to go back later)
    sessionStorage.setItem('previousRoute', '/superadmin');

    // Redirect to admin dashboard (you can later use admin.id or name if needed)
    router.push('/sales-admin');
  };

  // ✅ Detect back navigation and redirect to /superadmin
  React.useEffect(() => {
    const handlePopState = () => {
      router.push('/superadmin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">Admin Management</h1>
        <p className="text-gray-600 text-lg">
          Manage your super admins, admins, and moderators.
        </p>
      </div>

      {/* Dropdown Filter */}
      <div className="mr-250 mb-6 text-center">
        <label className="text-sm text-gray-600 block mb-1">Select Admin</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
          value={selectedAdmin}
          onChange={(e) => setSelectedAdmin(e.target.value)}
        >
          <option value="All">All</option>
          {uniqueAdmins.map((adminName, index) => (
            <option key={index} value={adminName}>
              {adminName}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-[#D7E7D0] text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Representative Id</th>
              <th className="px-4 py-2 border">Profile Picture</th>
              <th className="px-4 py-2 border">Admin Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin, index) => (
                <tr
                  key={admin.id}
                  className="hover:bg-green-50 cursor-pointer transition"
                  onClick={() => handleRowClick(admin)}
                >
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">
                    <img
                      src={admin.profilePic}
                      alt={admin.name}
                      className="w-10 h-10 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border">{admin.name}</td>
                  <td className="px-4 py-2 border">{admin.email}</td>
                  <td className="px-4 py-2 border">{admin.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 border">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredAdmins.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Admins Found</h3>
          <p className="text-gray-500">Try selecting “All” or adjust your filters.</p>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin_Admin;
