'use client';

import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

const PaymentsTab = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);

  const [payments, setPayments] = useState([
    {
      id: 1,
      agentId: 'A101',
      agentName: 'Rohit Sharma',
      clientName: 'Neha Gupta',
      projectName: 'Sunrise Residency',
      clientEstimate: '₹12,00,000',
      agentShare: '₹1,20,000',
      agentPaid: '₹80,000',
      due: '₹40,000',
      paymentStatus: 'Due',
      transactions: [
        {
          date: '2025-10-01',
          time: '10:32 AM',
          proof: './founder.jpg',
        },
        {
          date: '2025-10-20',
          time: '3:15 PM',
          proof: '/sample2.jpg',
        },
      ],
    },
    {
      id: 2,
      agentId: 'A102',
      agentName: 'Priya Das',
      clientName: 'Rajesh Kumar',
      projectName: 'Green Valley Homes',
      clientEstimate: '₹18,50,000',
      agentShare: '₹1,85,000',
      agentPaid: '₹1,85,000',
      due: '₹0',
      paymentStatus: 'Paid',
      transactions: [
        {
          date: '2025-09-12',
          time: '12:00 PM',
          proof: '/sample3.jpg',
        },
      ],
    },
    {
      id: 3,
      agentId: 'A103',
      agentName: 'Sourav Sen',
      clientName: 'Ananya Paul',
      projectName: 'Dream City Heights',
      clientEstimate: '₹9,75,000',
      agentShare: '₹97,500',
      agentPaid: '₹60,000',
      due: '₹37,500',
      paymentStatus: 'Due',
      transactions: [],
    },
    {
      id: 4,
      agentId: 'A104',
      agentName: 'Karan Mehta',
      clientName: 'Sneha Roy',
      projectName: 'Lake View Villas',
      clientEstimate: '₹15,20,000',
      agentShare: '₹1,52,000',
      agentPaid: '₹1,52,000',
      due: '₹0',
      paymentStatus: 'Paid',
      transactions: [
        {
          date: '2025-08-10',
          time: '9:00 AM',
          proof: '/sample4.jpg',
        },
      ],
    },
  ]);

  const handleStatusChange = (id: number, value: string) => {
    setPayments(prev =>
      prev.map(row =>
        row.id === id ? { ...row, paymentStatus: value } : row
      )
    );
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
    const matchesFilter = filter === 'All' || p.paymentStatus === filter;
    const matchesSearch =
      p.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
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
              <th className="px-4 py-2 text-left">Transaction Proof</th>
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
                  <td className="px-4 py-2">{highlightText(row.agentId)}</td>
                  <td className="px-4 py-2">{highlightText(row.agentName)}</td>
                  <td className="px-4 py-2">{highlightText(row.clientName)}</td>
                  <td className="px-4 py-2">{row.projectName}</td>
                  <td className="px-4 py-2">{row.clientEstimate}</td>
                  <td className="px-4 py-2">{row.agentShare}</td>
                  <td className="px-4 py-2">{row.agentPaid}</td>
                  <td className="px-4 py-2">{row.due}</td>
                  <td className="px-4 py-2">
                    <select
                      value={row.paymentStatus}
                      onChange={e => handleStatusChange(row.id, e.target.value)}
                      className={`px-2 py-1 rounded-md border text-white font-medium cursor-pointer ${
                        row.paymentStatus === 'Paid'
                          ? 'bg-green-500 border-green-600'
                          : 'bg-red-500 border-red-600'
                      }`}
                    >
                      <option value="Paid" className="text-black">Paid</option>
                      <option value="Due" className="text-black">Due</option>
                    </select>
                  </td>

                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedAgent(row)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Tap to View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No records found for selected filter or search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Proof Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[85vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedAgent(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold text-[#295A47] mb-4 text-center">
              Transaction Details – {selectedAgent.agentId}
            </h2>

            {selectedAgent.transactions.length > 0 ? (
              <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
                <thead className="bg-[#295A47] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Sl. No</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Transaction Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAgent.transactions.map((t: any, i: number) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{t.date}</td>
                      <td className="px-4 py-2">{t.time}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <a
                            href={t.proof}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                          <a
                            href={t.proof}
                            download
                            className="text-green-600 underline"
                          >
                            Download
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600 italic py-6">
                No transactions available for this agent.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentsTab;
