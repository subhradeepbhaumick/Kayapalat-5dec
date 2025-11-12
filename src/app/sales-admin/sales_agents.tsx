'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Calendar, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';

interface Agent {
  id: number;
  name: string;
  phone: string;
  whatsapp: string;
  profilePic: string;
  address: string;
  date: string;
}

const AgentsTab = () => {
  // Dummy data
  const [agents] = useState<Agent[]>([
    {
      id: 1,
      name: 'Rahul Sharma',
      phone: '9876543210',
      whatsapp: '9876543210',
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      address: 'Kolkata, India',
      date: '2025-11-05',
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      phone: '9876543210',
      whatsapp: '9876543210',
      profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
      address: 'Kolkata, India',
      date: '2025-11-07',
    },
    {
      id: 3,
      name: 'Ananya Sen',
      phone: '9123456789',
      whatsapp: '9123456789',
      profilePic: 'https://randomuser.me/api/portraits/women/2.jpg',
      address: 'Howrah, India',
      date: '2025-11-03',
    },
    {
      id: 4,
      name: 'Sourav Das',
      phone: '9832012345',
      whatsapp: '9832012345',
      profilePic: 'https://randomuser.me/api/portraits/men/3.jpg',
      address: 'Salt Lake, India',
      date: '2025-11-02',
    },
  ]);

  // Extract agent names for dropdown
  const uniqueAgents = Array.from(new Set(agents.map((a) => a.name)));
  const [selectedAgent, setSelectedAgent] = useState<string>('All');

  // Date filter states
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Filter logic
  const filteredAgents = agents.filter((agent) => {
    const matchesAgent = selectedAgent === 'All' || agent.name === selectedAgent;
    const agentDate = new Date(agent.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesFromDate = !from || agentDate >= from;
    const matchesToDate = !to || agentDate <= to;
    return matchesAgent && matchesFromDate && matchesToDate;
  });

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">
          Agents Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your sales agents and their performance.
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-end items-center gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-600 block mb-1">From Date</label>
          <input
            type="date"
            className="border p-2 rounded-md mr-10"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">To Date</label>
          <input
            type="date"
            className="border p-2 rounded-md mr-145"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mr-3 font-medium text-gray-700">Agent:</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueAgents.map((agentName, index) => (
              <option key={index} value={agentName}>
                {agentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-[#d7e7d0] text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Agent ID</th>
              <th className="px-4 py-2 border">Profile Picture</th>
              <th className="px-4 py-2 border">Agent Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">WhatsApp</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent, index) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <img
                      src={agent.profilePic}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full mx-auto object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border">{agent.name}</td>
                  <td className="px-4 py-2 border">{agent.phone}</td>
                  <td className="px-4 py-2 border">{agent.whatsapp}</td>
                  <td className="px-4 py-2 border">{agent.address}</td>
                  <td className="px-4 py-2 border">{agent.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-4 text-gray-500 border"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Agents Found
          </h3>
          <p className="text-gray-500">
            Try selecting “All” or check your database connection.
          </p>
        </div>
      )}
    </>
  );
};

export default AgentsTab;