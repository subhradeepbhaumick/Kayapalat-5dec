"use client";

import React, { useState } from "react";

type Tab = "cold" | "site" | "booking";

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("cold");
  const [status, setStatus] = useState("all");
  const [showEntries, setShowEntries] = useState("all");
  const [filterType, setFilterType] = useState<'all' | 'residential' | 'commercial'>('all');

  const siteVisitData = [
    { id: 1, appId: "HD7345667", project: "Rajwada Grand", client: "Kalyan Chatterjee", address: "Kolkata", phone: "+91 9999999999", req: "3BHK", status: "Upcoming", rep: "John Bor", propertyType: "Residential" },
    { id: 2, appId: "HD7345668", project: "Rajwada Grand", client: "Arun Kumar", address: "Delhi", phone: "+91 8888888888", req: "2BHK", status: "Upcoming", rep: "Jane Doe", propertyType: "Residential" },
    { id: 3, appId: "HD7345669", project: "Commercial Plaza", client: "Business Corp", address: "Mumbai", phone: "+91 7777777777", req: "Office Space", status: "Upcoming", rep: "Mike Smith", propertyType: "Commercial" },
    { id: 4, appId: "HD7345670", project: "Rajwada Grand", client: "Priya Singh", address: "Bangalore", phone: "+91 6666666666", req: "4BHK", status: "Upcoming", rep: "Alex Johnson", propertyType: "Residential" },
    { id: 5, appId: "HD7345671", project: "Commercial Plaza", client: "Tech Solutions", address: "Pune", phone: "+91 5555555555", req: "Warehouse", status: "Upcoming", rep: "Sara Lee", propertyType: "Commercial" },
  ];

  const filteredData = siteVisitData.filter(item => filterType === 'all' || item.propertyType.toLowerCase() === filterType);

  const totalCount = siteVisitData.length;
  const residentialCount = siteVisitData.filter(item => item.propertyType === 'Residential').length;
  const commercialCount = siteVisitData.filter(item => item.propertyType === 'Commercial').length;

  const renderTable = () => {
    switch (activeTab) {
      case "cold":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Project Name</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Cold Call Status</th>
                <th className="p-2 border">Representative Name</th>
                <th className="p-2 border">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {/* Example row */}
              <tr>
                <td className="p-2 border text-center">1</td>
                <td className="p-2 border">Rajwada Grand</td>
                <td className="p-2 border">Kalyan Chatterjee</td>
                <td className="p-2 border">Kolkata</td>
                <td className="p-2 border">+91 9999999999</td>
                <td className="p-2 border">Interested</td>
                <td className="p-2 border">John Bor</td>
                <td className="p-2 border">12/01/20, 4PM</td>
              </tr>
            </tbody>
          </table>
        );

      case "site":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Appointment ID</th>
                <th className="p-2 border">Project Name</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Requirements</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Representative Name</th>
                <th className="p-2 border">Property Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{item.appId}</td>
                  <td className="p-2 border">{item.project}</td>
                  <td className="p-2 border">{item.client}</td>
                  <td className="p-2 border">{item.address}</td>
                  <td className="p-2 border">{item.phone}</td>
                  <td className="p-2 border">{item.req}</td>
                  <td className="p-2 border">{item.status}</td>
                  <td className="p-2 border">{item.rep}</td>
                  <td className="p-2 border">{item.propertyType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "booking":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Appointment ID</th>
                <th className="p-2 border">Project Name</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Requirements</th>
                <th className="p-2 border">Booking Status</th>
                <th className="p-2 border">Representative Name</th>
                <th className="p-2 border">Property Type</th>
                <th className="p-2 border">Payment Amount</th>
                <th className="p-2 border">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border text-center">1</td>
                <td className="p-2 border">BK456321</td>
                <td className="p-2 border">Rajwada Grand</td>
                <td className="p-2 border">Kalyan Chatterjee</td>
                <td className="p-2 border">Kolkata</td>
                <td className="p-2 border">+91 9999999999</td>
                <td className="p-2 border">3BHK</td>
                <td className="p-2 border">Confirmed</td>
                <td className="p-2 border">John Bor</td>
                <td className="p-2 border">Residential</td>
                <td className="p-2 border">₹10,00,000</td>
                <td className="p-2 border">Paid</td>
              </tr>
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hero Section with Title and Tabs */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-700">Sales</h1>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "cold" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
            onClick={() => setActiveTab("cold")}
          >
            Cold Calling
          </button>
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "site" ? "bg-blue-600 text-white" : "bg-white border"
            }`}
            onClick={() => setActiveTab("site")}
          >
            Site Visit
          </button>
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "booking"
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
            onClick={() => setActiveTab("booking")}
          >
            Bookings
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Select Status</label>
            <select
              className="border p-2 rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="not_responding">Not Responding</option>
              <option value="no_show">No Show</option>
              <option value="not_interested">Not Interested</option>
              <option value="booked">Booked</option>
              <option value="time_asc">By Time Ascending</option>
              <option value="time_desc">By Time Descending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">From Date</label>
            <input type="date" className="border p-2 rounded-md" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">To Date</label>
            <input type="date" className="border p-2 rounded-md" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Show</label>
          <select
            className="border p-2 rounded-md"
            value={showEntries}
            onChange={(e) => setShowEntries(e.target.value)}
          >
            <option value="all">All</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="ml-2 text-sm text-gray-600">entries</span>
        </div>
      </div>

      {/* Stats */}
      {activeTab === "site" && (
        <div className="flex gap-6 mt-6">
          <button
            className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => setFilterType('all')}
          >
            <p className="text-gray-500 text-sm">Total upcoming visit: <span className="font-semibold">{totalCount}</span></p>
          </button>
          <button
            className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => setFilterType('residential')}
          >
            <p className="text-gray-500 text-sm">Residential upcoming visit: <span className="font-semibold">{residentialCount}</span></p>
          </button>
          <button
            className="p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            onClick={() => setFilterType('commercial')}
          >
            <p className="text-gray-500 text-sm">Commercial upcoming visit: <span className="font-semibold">{commercialCount}</span></p>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
        {renderTable()}
      </div>
    </div>
  );
};

export default SalesPage;
