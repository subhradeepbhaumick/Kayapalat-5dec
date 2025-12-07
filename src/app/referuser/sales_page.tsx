"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "cold" | "site" | "booking" | "booked";

interface ProjectData {
  appointment_id: number;
  lead_id: string;
  client_name: string;
  client_phone: string;
  location: string;
  project_value: number;
  commission: number;
  agent_share: number;
  property_type: string;
  cold_call_date: string;
  cold_call_time: string;
  cold_call_status: string;
  site_visit_date: string;
  site_visit_time: string;
  site_visit_status: string;
  booking_date: string;
  booking_time: string;
  booking_status: string;
  booking_id: string;
  agent_name: string;
  address?: string;
  lead_date?: string;
  created_at?: string;
}

interface SalesPageProps {
  agentId?: string;
}

const SalesPage: React.FC<SalesPageProps> = ({ agentId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("cold");
  const [status, setStatus] = useState("all");
  const [showEntries, setShowEntries] = useState("all");
  const [filterType, setFilterType] = useState<'all' | 'residential' | 'commercial'>('all');
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }
        const response = await fetch('/api/sales-admin/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjectsData(data.projects || []);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredData = projectsData.filter((project) => {
    const matchesType = filterType === 'all' || project.property_type.toLowerCase() === filterType;
    let matchesStatus = false;
    switch (activeTab) {
      case 'cold':
        matchesStatus = project.cold_call_status !== 'Confirmed';
        break;
      case 'site':
        matchesStatus = project.cold_call_status === 'Confirmed' && project.site_visit_status !== 'Confirmed';
        break;
      case 'booking':
        matchesStatus = project.site_visit_status === 'Confirmed';
        break;
      case 'booked':
        matchesStatus = project.booking_status === 'Booked';
        break;
    }
    return matchesType && matchesStatus;
  });

  const totalCount = projectsData.length;
  const residentialCount = projectsData.filter(item => item.property_type === 'Residential').length;
  const commercialCount = projectsData.filter(item => item.property_type === 'Commercial').length;

  const renderTable = () => {
    if (loading) {
      return <div className="text-center mt-4">Loading...</div>;
    }

    switch (activeTab) {
      case "cold":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-[#295A47] text-white">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Lead ID</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Lead Date</th>
                <th className="p-2 border">Property Type</th>
                <th className="p-2 border">Cold Call Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.lead_id}>
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{item.lead_id}</td>
                  <td className="p-2 border">{item.client_name}</td>
                  <td className="p-2 border">{item.client_phone}</td>
                  <td className="p-2 border">{item.location}</td>
                  <td className="p-2 border">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-2 border">{item.property_type}</td>
                  <td className="p-2 border">{item.cold_call_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "site":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-[#295A47] text-white">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Appointment ID</th>
                <th className="p-2 border">Lead ID</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Property Type</th>
                <th className="p-2 border">Site Visit Status</th>
                <th className="p-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.lead_id}>
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{item.appointment_id}</td>
                  <td className="p-2 border">{item.lead_id}</td>
                  <td className="p-2 border">{item.client_name}</td>
                  <td className="p-2 border">{item.client_phone}</td>
                  <td className="p-2 border">{item.location}</td>
                  <td className="p-2 border">{item.property_type}</td>
                  <td className="p-2 border">{item.site_visit_status}</td>
                  <td className="p-2 border">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "booking":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-[#295A47] text-white">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Appointment ID</th>
                <th className="p-2 border">Lead ID</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Project Value</th>
                <th className="p-2 border">Commission</th>
                <th className="p-2 border">Agent Share</th>
                <th className="p-2 border">Property Type</th>
                <th className="p-2 border">Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.lead_id}>
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{item.appointment_id}</td>
                  <td className="p-2 border">{item.lead_id}</td>
                  <td className="p-2 border">{item.client_name}</td>
                  <td className="p-2 border">{item.client_phone}</td>
                  <td className="p-2 border">₹{item.project_value.toLocaleString()}</td>
                  <td className="p-2 border">{item.commission}%</td>
                  <td className="p-2 border">₹{item.agent_share.toLocaleString()}</td>
                  <td className="p-2 border">{item.property_type}</td>
                  <td className="p-2 border">{item.booking_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "booked":
        return (
          <table className="min-w-full border mt-4">
            <thead className="bg-[#295A47] text-white">
              <tr>
                <th className="p-2 border">Sl.No</th>
                <th className="p-2 border">Appointment ID</th>
                <th className="p-2 border">Lead ID</th>
                <th className="p-2 border">Client Name</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Project Value</th>
                <th className="p-2 border">Commission</th>
                <th className="p-2 border">Agent Share</th>
                <th className="p-2 border">Property Type</th>
                <th className="p-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.lead_id}>
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">{item.appointment_id}</td>
                  <td className="p-2 border">{item.lead_id}</td>
                  <td className="p-2 border">{item.client_name}</td>
                  <td className="p-2 border">{item.client_phone}</td>
                  <td className="p-2 border">₹{item.project_value.toLocaleString()}</td>
                  <td className="p-2 border">{item.commission}%</td>
                  <td className="p-2 border">₹{item.agent_share.toLocaleString()}</td>
                  <td className="p-2 border">{item.property_type}</td>
                  <td className="p-2 border">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hero Section with Title and Tabs */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-green-900">Sales</h1>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "cold" ? "bg-green-900 text-white" : "bg-white border"
            }`}
            onClick={() => setActiveTab("cold")}
          >
            Cold Calling
          </button>
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "site" ? "bg-green-900 text-white" : "bg-white border"
            }`}
            onClick={() => setActiveTab("site")}
          >
            Site Visit
          </button>
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "booking"
                ? "bg-green-900 text-white"
                : "bg-white border"
            }`}
            onClick={() => setActiveTab("booking")}
          >
            Prospect
          </button>
          <button
            className={`px-4 py-2 rounded-3xl ${
              activeTab === "booked"
                ? "bg-green-900 text-white"
                : "bg-white border"
            }`}
            onClick={() => setActiveTab("booked")}
          >
            Booked
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
            className="border p-2 rounded-xl"
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
      <div className="bg-white mt-4 p-4 rounded-lg shadow-sm overflow-x-auto">
        {renderTable()}
      </div>
    </div>
  );
};

export default SalesPage;
