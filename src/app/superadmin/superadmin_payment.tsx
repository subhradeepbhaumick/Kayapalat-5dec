'use client';

import React, { useState } from 'react';
import { BarChart3, Filter, Search, UserCog, X, Trash2, Upload } from 'lucide-react';

const PaymentsTab = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('All');
  const [showBankModal, setShowBankModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [displayData, setDisplayData] = useState<any>(null);
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);

  // Store transaction proofs per agent
  const [transactionProofs, setTransactionProofs] = useState<Record<string, any[]>>({});

  const adminAgentMap: Record<string, string[]> = {
    'A01': ['A101', 'A102'],
    'A02': ['A103', 'A104'],
  };
  
  const [payments, setPayments] = useState([
    {
      id: 1,
      agentId: 'A101',
      agentName: 'Rohit Sharma',
      clientName: 'Neha Gupta',
      projectName: 'Sunrise Residency',
      clientEstimate: '₹12,00,000',
      agentShare: 120000,
      agentPaid: 80000,
      due: 40000,
      paymentStatus: 'Due',
      bankDetails: {
        accountHolderName: 'Rohit Sharma',
        upiId: 'rohit@ybl',
        bankName: 'HDFC Bank',
        accountNumber: '123456789012',
        ifscCode: 'HDFC0001234',
        upiQr: 'https://example.com/rohit_qr.png',
      },
    },
    {
      id: 2,
      agentId: 'A102',
      agentName: 'Priya Das',
      clientName: 'Rajesh Kumar',
      projectName: 'Green Valley Homes',
      clientEstimate: '₹18,50,000',
      agentShare: 185000,
      agentPaid: 185000,
      due: 0,
      paymentStatus: 'Paid',
      bankDetails: {
        accountHolderName: 'Priya Das',
        upiId: 'priya@okicici',
        bankName: 'ICICI Bank',
        accountNumber: '987654321012',
        ifscCode: 'ICIC0005678',
        upiQr: 'https://example.com/priya_qr.png',
      },
    },
    {
      id: 3,
      agentId: 'A103',
      agentName: 'Sourav Sen',
      clientName: 'Ananya Paul',
      projectName: 'Dream City Heights',
      clientEstimate: '₹9,75,000',
      agentShare: 97500,
      agentPaid: 60000,
      due: 37500,
      paymentStatus: 'Due',
      bankDetails: {
        accountHolderName: 'Sourav Sen',
        upiId: 'sourav@okaxis',
        bankName: 'Axis Bank',
        accountNumber: '111122223333',
        ifscCode: 'UTIB0002244',
        upiQr: '',
      },
    },
    {
      id: 4,
      agentId: 'A104',
      agentName: 'Karan Mehta',
      clientName: 'Sneha Roy',
      projectName: 'Lake View Villas',
      clientEstimate: '₹15,20,000',
      agentShare: 152000,
      agentPaid: 152000,
      due: 0,
      paymentStatus: 'Paid',
      bankDetails: {
        accountHolderName: 'Karan Mehta',
        upiId: 'karan@okhdfc',
        bankName: 'HDFC Bank',
        accountNumber: '444433332222',
        ifscCode: 'HDFC0007890',
        upiQr: 'https://example.com/karan_qr.png',
      },
    },
  ]);

  const handleInputChange = (id: number, field: string, value: number) => {
    setPayments(prev =>
      prev.map(row =>
        row.id === id
          ? {
              ...row,
              [field]: value,
              ...(field === 'agentShare' || field === 'agentPaid'
                ? {
                    due: Math.max(
                      (field === 'agentShare' ? value : row.agentShare) -
                        (field === 'agentPaid' ? value : row.agentPaid),
                      0
                    ),
                  }
                : {}),
            }
          : row
      )
    );
  };

  const handleStatusChange = (id: number, value: string) => {
    setPayments(prev =>
      prev.map(row =>
        row.id === id ? { ...row, paymentStatus: value } : row
      )
    );
  };

  const handleBankView = (bankDetails: any) => {
    setDisplayData(bankDetails);
    setShowBankModal(true);
  };

  const handleProofView = (agentId: string) => {
    setCurrentAgentId(agentId);
    setShowProofModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentAgentId) return;
    const file = e.target.files?.[0];
    if (file) {
      const proofURL = URL.createObjectURL(file);
      const newProof = {
        id: Date.now(),
        file: proofURL,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      };
      setTransactionProofs(prev => ({
        ...prev,
        [currentAgentId]: [...(prev[currentAgentId] || []), newProof],
      }));
    }
  };

  const handleDeleteProof = (agentId: string, proofId: number) => {
    setTransactionProofs(prev => ({
      ...prev,
      [agentId]: prev[agentId].filter(p => p.id !== proofId),
    }));
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
    const matchesAdmin =
      selectedAdmin === 'All' ||
      adminAgentMap[selectedAdmin]?.includes(p.agentId);
    const matchesFilter = filter === 'All' || p.paymentStatus === filter;
    const matchesSearch =
      p.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAdmin && matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-2">Payments</h1>
        <p className="text-gray-600 text-lg">
          Analyze and manage payments by Admin and Agent.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <UserCog className="w-5 h-5 text-gray-600" />
          <label className="text-gray-700 font-medium">Admin:</label>
          <select
            value={selectedAdmin}
            onChange={e => setSelectedAdmin(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#295A47]"
          >
            <option value="All">All</option>
            <option value="A01">Susmita</option>
            <option value="A02">Meghadipa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <label className="text-gray-700 font-medium">Status:</label>
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
              <th className="px-4 py-2">Sl. No</th>
              <th className="px-4 py-2">Agent ID</th>
              <th className="px-4 py-2">Agent Name</th>
              <th className="px-4 py-2">Client Name</th>
              <th className="px-4 py-2">Project Name</th>
              <th className="px-4 py-2">Client Estimate</th>
              <th className="px-4 py-2">Agent Share (₹)</th>
              <th className="px-4 py-2">Agent Paid (₹)</th>
              <th className="px-4 py-2">Due (₹)</th>
              <th className="px-4 py-2">Payment Status</th>
              <th className="px-4 py-2">Bank Details</th>
              <th className="px-4 py-2">Transaction Proof</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((row, i) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{highlightText(row.agentId)}</td>
                <td className="px-4 py-2">{highlightText(row.agentName)}</td>
                <td className="px-4 py-2">{highlightText(row.clientName)}</td>
                <td className="px-4 py-2">{row.projectName}</td>
                <td className="px-4 py-2">{row.clientEstimate}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={row.agentShare}
                    onChange={e => handleInputChange(row.id, 'agentShare', Number(e.target.value))}
                    className="border rounded-md px-2 py-1 w-28"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={row.agentPaid}
                    onChange={e => handleInputChange(row.id, 'agentPaid', Number(e.target.value))}
                    className="border rounded-md px-2 py-1 w-28"
                  />
                </td>
                <td className="px-4 py-2">
                  <input type="number" readOnly value={row.due} className="border bg-gray-100 rounded-md px-2 py-1 w-28" />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.paymentStatus}
                    onChange={e => handleStatusChange(row.id, e.target.value)}
                    className={`px-2 py-1 rounded-md border text-white font-medium cursor-pointer ${
                      row.paymentStatus === 'Paid'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    <option value="Paid" className="text-black">Paid</option>
                    <option value="Due" className="text-black">Due</option>
                  </select>
                </td>
                <td
                  className="px-4 py-2 text-blue-600 underline cursor-pointer"
                  onClick={() => handleBankView(row.bankDetails)}
                >
                  Tap to View
                </td>
                <td
                  className="px-4 py-2 text-indigo-600 underline cursor-pointer"
                  onClick={() => handleProofView(row.agentId)}
                >
                  Post
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Proof Modal */}
      {showProofModal && currentAgentId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowProofModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Transaction Proofs - Agent {currentAgentId}
            </h2>

            <div className="flex items-center justify-center mb-6">
              <label className="cursor-pointer flex items-center gap-2 bg-[#295A47] text-white px-4 py-2 rounded-lg hover:bg-[#3a6b58]">
                <Upload className="w-5 h-5" />
                Upload Proof
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="overflow-x-auto border-t pt-4">
              <table className="min-w-full border border-gray-300 text-center">
                <thead className="bg-[#295A47] text-white">
                  <tr>
                    <th className="px-4 py-2 border">Sl No</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Time</th>
                    <th className="px-4 py-2 border">Proof Image</th>
                    <th className="px-4 py-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(transactionProofs[currentAgentId] || []).map((p, i) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2 border">{i + 1}</td>
                      <td className="px-4 py-2 border">{p.date}</td>
                      <td className="px-4 py-2 border">{p.time}</td>
                      <td className="px-4 py-2 border">
                        <a
                          href={p.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDeleteProof(currentAgentId, p.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!transactionProofs[currentAgentId] ||
                    transactionProofs[currentAgentId].length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="italic text-gray-500 py-4"
                      >
                        No transaction proofs uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentsTab;
