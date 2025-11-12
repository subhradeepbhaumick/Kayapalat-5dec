'use client';

import React, { useState } from 'react';
import { Menu, Bell, LayoutDashboard, Users, UserPlus, BarChart3, ClipboardList, Search, LogOut, User,Settings } from 'lucide-react';
import AdminTab from './superadmin_admin';
import AgentTab from './superadmin_agent';
import PaymentTab from './superadmin_payment';

const SuperAdmin = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Mock user data (since no backend)
  const user = {
    name: "John Bor",
    profilePicture: "/founder.jpg" // Using existing image from public folder
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'Dashboard' },
    { icon: Users, label: 'Admin', key: 'Admin' },
    { icon: Users, label: 'Agent', key: 'Agent' },
    { icon: UserPlus, label: 'Payments', key: 'Payments' },
    { icon: UserPlus, label: 'Invoices', key: 'Invoices' },
    { icon: BarChart3, label: 'Business Insights', key: 'Business Insights' },
    { icon: Bell, label: 'Notifications', key: 'Notifications' },
    { icon: ClipboardList, label: 'To Do', key: 'To Do' },
    { icon: Settings, label: 'Settings', key: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#D2EBD0] flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Header Section */}
        <div className="p-4 border-b bg-[#D7E7D0]">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to user icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'block';
                      }
                    }}
                  />
                  <User className="w-6 h-6 text-gray-500 hidden" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#DC0835]">{user.name}</h3>
                  <p className="text-sm text-gray-600">Super Admin</p>
                  <p className="text-sm text-black-600">ID: <strong>A123</strong></p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-[#295A47] hover:text-[#1e3d32] transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-6'} py-3 cursor-pointer transition-colors ${
                activeTab === item.key
                  ? 'bg-[#D7E7D0] text-[#295A47] border-r-4 border-[#295A47]'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium ml-3">{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-20">
        {/* Navbar */}
        <div className={`bg-white shadow-md p-4 flex justify-between items-center fixed top-0 z-40 ${sidebarCollapsed ? 'lg:left-16 left-0' : 'lg:left-64 left-0'} right-0`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 pr-80 pl-2">
              <img
                src="/kayapalat-logo.png"
                alt="Kayapalat Logo"
                className="h-6 w-auto"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  e.currentTarget.style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextSibling) {
                    nextSibling.style.display = 'block';
                  }
                }}
              />
              <h1 className="text-xl font-bold text-[#295A47] hidden">KAYAPALAT</h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#295A47] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <button className="flex items-center space-x-2 font-semibold text-gray-700 hover:text-[#295A47] transition-colors">
            <LogOut size={25}  />
            <span>Logout</span>
          </button>
        </div>

        {/* Welcome Bar */}
        <div className="bg-[#295A47] text-white py-3 px-8">
          <div className="max-w-4xl mx-auto">
            <h4 className="text-lg font-semibold text-center">Welcome to Super Admin Dashboard</h4>
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-8">
          <div className="max-w-8xl pt-4 mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              {activeTab === 'Dashboard' && (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#295A47] mb-4">
                      Super Admin Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Manage your sales operations, agents, leads, and business insights.
                    </p>
                  </div>

                  {/* Placeholder Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#D7E7D0] rounded-lg p-6 text-center">
                      <Users className="w-12 h-12 text-[#295A47] mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-[#295A47]">0</h3>
                      <p className="text-gray-700">Active Agents</p>
                    </div>
                    <div className="bg-[#D7E7D0] rounded-lg p-6 text-center">
                      <UserPlus className="w-12 h-12 text-[#295A47] mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-[#295A47]">0</h3>
                      <p className="text-gray-700">Total Leads</p>
                    </div>
                    <div className="bg-[#D7E7D0] rounded-lg p-6 text-center">
                      <BarChart3 className="w-12 h-12 text-[#295A47] mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-[#295A47]">₹0</h3>
                      <p className="text-gray-700">Revenue</p>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'Admin' && (
                <AdminTab />
              )}
              {activeTab === 'Agent' && (
                <AgentTab />
              )}
              {activeTab === 'Payments' && (
                <PaymentTab />
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default SuperAdmin;
