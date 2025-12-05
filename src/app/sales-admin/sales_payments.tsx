'use client';

import React, { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';

const PaymentsTab = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await fetch('/api/sales-admin/payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setPayments(result.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, value: string) => {
    try {
      const response = await fetch('/api/sales-admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment_id: id,
          payment_status: value,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setPayments(prev =>
          prev.map(row =>
            row.id === id ? { ...row, payment_status: value } : row
          )
        );
      } else {
        console.error('Error updating payment status:', result.error);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const highlightText = (text: string) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 text-black font-semibold px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'All' || p.payment_status === filter;
    const matchesSearch =
      p.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.agent_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">Payments</h1>
        <p className="text-gray-600 text-lg">
          Analyze your business performance and trends.
        </p>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <label className="text-gray-700 font-medium">Filter:</label>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#295A47]"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
        </div>

        <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full sm:w-1/3 focus-within:ring-2 focus-within:ring-[#295A47]">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Agent ID, Agent or Client..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-[#295A47] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Sl. No</th>
              <th className="px-4 py-2 text-left">Agent ID</th>
              <th className="px-4 py-2 text-left">Agent Name</th>
              <th className="px-4 py-2 text-left">Client Name</th>
              <th className="px-4 py-2 text-left">Project Name</th>
              <th className="px-4 py-2 text-left">Client Estimate</th>
              <th className="px-4 py-2 text-left">Agent Share</th>
              <th className="px-4 py-2 text-left">Agent Paid</th>
              <th className="px-4 py-2 text-left">Due</th>
              <th className="px-4 py-2 text-left">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{highlightText(row.agent_id)}</td>
                  <td className="px-4 py-2">{highlightText(row.agent_name)}</td>
                  <td className="px-4 py-2">{highlightText(row.client_name)}</td>
                  <td className="px-4 py-2">{row.project_name}</td>
                  <td className="px-4 py-2">{row.client_estimate}</td>
                  <td className="px-4 py-2">{row.agent_share}</td>
                  <td className="px-4 py-2">{row.agent_paid}</td>
                  <td className="px-4 py-2">{row.due}</td>
                  <td className="px-4 py-2">
                    <select
                      value={row.payment_status}
                      onChange={e => handleStatusChange(row.id, e.target.value)}
                      className={`px-2 py-1 rounded-md border text-white font-medium cursor-pointer ${
                        row.payment_status === 'Paid'
                          ? 'bg-green-500 border-green-600'
                          : 'bg-red-500 border-red-600'
                      }`}
                    >
                      <option value="Paid" className="text-black">Paid</option>
                      <option value="Due" className="text-black">Due</option>
                    </select>
                  </td>

                  
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No records found for selected filter or search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </>
  );
};

export default PaymentsTab;
