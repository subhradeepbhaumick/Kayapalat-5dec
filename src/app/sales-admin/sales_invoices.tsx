'use client';

import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';

interface InvoiceData {
  billerDetails: {
    name: string;
    address: string;
    contact: string;
  };
  agentDetails: {
    name: string;
    id: string;
    contact: string;
  };
  clientDetails: {
    name: string;
    contact: string;
  };
  propertyDetails: {
    name: string;
  };
  totalEstimate: number;
  agentShare: number;
  paid: number;
  due: number;
  paymentStatus: string;
  invoiceDate: string;
  invoiceTime: string;
}

interface Project {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
  projects: Project[];
  contact: string;
}

interface Agent {
  id: string;
  name: string;
  clients: Client[];
}

// Dummy hierarchical data
const agentsData: Agent[] = [
  {
    id: 'A101',
    name: 'Rohit Das',
    clients: [
      {
        id: 'C001',
        name: 'Amit Sharma',
        contact: '9876543210',
        projects: [
          { id: 'P001', name: 'Green Valley Residency' },
          { id: 'P002', name: 'Sunshine Apartments' },
        ],
      },
    ],
  },
  {
    id: 'A102',
    name: 'Priya Sen',
    clients: [
      {
        id: 'C002',
        name: 'Rakesh Gupta',
        contact: '9123456780',
        projects: [{ id: 'P003', name: 'Skyline Heights' }],
      },
      {
        id: 'C003',
        name: 'Niles Gupta',
        contact: '9123654780',
        projects: [{ id: 'P004', name: 'Airline Lights' }],
      },
    ],
  },
];

const InvoicesTable = () => {
  const [agentInput, setAgentInput] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agentsData);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [invoicesList, setInvoicesList] = useState<InvoiceData[]>([]);
  const [showPreviousInvoices, setShowPreviousInvoices] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLTableDataCellElement>(null);

  // Update time every second
  useEffect(() => {
    if (!modalOpen || !invoiceData) return;
    const interval = setInterval(() => {
      const now = new Date();
      setInvoiceData(prev => prev ? { ...prev, invoiceTime: now.toLocaleTimeString() } : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [modalOpen, invoiceData]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAgentInputChange = (value: string) => {
    setAgentInput(value);
    setSelectedAgent(null);
    setSelectedClient(null);
    setSelectedProject(null);

    const filtered = agentsData.filter(
      (agent) =>
        agent.name.toLowerCase().includes(value.toLowerCase()) ||
        agent.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAgents(filtered);
    setDropdownOpen(true);
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentInput(`${agent.name} (${agent.id})`);
    setDropdownOpen(false);
    setSelectedClient(null);
    setSelectedProject(null);
  };

  const handleClientChange = (clientId: string) => {
    const client = selectedAgent?.clients.find((c) => c.id === clientId) || null;
    setSelectedClient(client);
    setSelectedProject(null);
  };

  const handleProjectChange = (projectId: string) => {
    const project = selectedClient?.projects.find((p) => p.id === projectId) || null;
    setSelectedProject(project);
  };

  const handleInvoiceClick = () => {
    if (!selectedAgent || !selectedClient || !selectedProject) return;

    const now = new Date();
    const invoiceDate = now.toLocaleDateString();
    const invoiceTime = now.toLocaleTimeString();

    // Dummy biller details
    const billerDetails = {
      name: 'Kayapalat',
      address: '179-A, Survey Park Rd,Purba Diganta, Santoshpur,Kolkata - 70075, WB, India',
      contact: '+91 602-602-6026',
    };

    // Agent details from selectedAgent
    const agentDetails = {
      name: selectedAgent.name,
      id: selectedAgent.id,
      contact: selectedClient.contact, // Assuming agent's contact is same as client's for dummy
    };

    // Dummy values for estimates
    const totalEstimate = 50000; // Dummy
    const agentShare = 12000; // Dummy

    const initialPaid = 0;
    const due = agentShare - initialPaid;
    const paymentStatus = due <= 0 ? 'Paid' : 'Pending';

    setInvoiceData({
      billerDetails,
      agentDetails,
      clientDetails: {
        name: selectedClient.name,
        contact: selectedClient.contact,
      },
      propertyDetails: {
        name: selectedProject.name,
      },
      totalEstimate,
      agentShare,
      paid: initialPaid,
      due,
      paymentStatus,
      invoiceDate,
      invoiceTime,
    });
    setModalOpen(true);
  };

  const handlePaidChange = (value: string) => {
    if (!invoiceData) return;
    const paid = parseFloat(value) || 0;
    const due = invoiceData.agentShare - paid;
    const paymentStatus = due <= 0 ? 'Paid' : 'Pending';
    setInvoiceData({
      ...invoiceData,
      paid,
      due,
      paymentStatus,
    });
  };

  const handleSave = () => {
    // For now, just log the data. In real app, save to database.
    console.log('Saving invoice data:', invoiceData);
    if (invoiceData) {
      setInvoicesList(prev => [...prev, invoiceData]);
    }
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const generatePDF = (invoice: InvoiceData, invoiceId: string) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica', 'normal');

    // Title
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, { align: 'center' });

    // Invoice ID
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoiceId}`, 20, 35);

    // Date and Time
    doc.text(`Date: ${invoice.invoiceDate}`, 20, 45);
    doc.text(`Time: ${invoice.invoiceTime}`, 20, 55);

    // Biller Details
    doc.setFontSize(14);
    doc.text('Biller Details:', 20, 70);
    doc.setFontSize(12);
    doc.text(`Name: ${invoice.billerDetails.name}`, 20, 80);
    doc.text(`Address: ${invoice.billerDetails.address}`, 20, 90);
    doc.text(`Contact: ${invoice.billerDetails.contact}`, 20, 100);

    // Client Details
    doc.setFontSize(14);
    doc.text('Client Details:', 20, 115);
    doc.setFontSize(12);
    doc.text(`Name: ${invoice.clientDetails.name}`, 20, 125);
    doc.text(`Contact: ${invoice.clientDetails.contact}`, 20, 135);

    // Property Details
    doc.setFontSize(14);
    doc.text('Property Details:', 20, 150);
    doc.setFontSize(12);
    doc.text(`Name: ${invoice.propertyDetails.name}`, 20, 160);

    // Agent Details
    doc.setFontSize(14);
    doc.text('Billed To (Agent):', 20, 175);
    doc.setFontSize(12);
    doc.text(`Name: ${invoice.agentDetails.name}`, 20, 185);
    doc.text(`ID: ${invoice.agentDetails.id}`, 20, 195);
    doc.text(`Contact: ${invoice.agentDetails.contact}`, 20, 205);

    // Financial Details
    doc.setFontSize(14);
    doc.text('Financial Details:', 20, 220);
    doc.setFontSize(12);
    doc.text(`Total Estimate: ₹${invoice.totalEstimate.toLocaleString()}`, 20, 230);
    doc.text(`Agent's Share: ₹${invoice.agentShare.toLocaleString()}`, 20, 240);
    doc.text(`Paid: ₹${invoice.paid.toLocaleString()}`, 20, 250);
    doc.text(`Due: ₹${invoice.due.toLocaleString()}`, 20, 260);
    doc.text(`Payment Status: ${invoice.paymentStatus}`, 20, 270);

    // Save the PDF
    doc.save(`${invoiceId}.pdf`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Generate Invoices</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-[#295A47] to-[#3a7d5f] text-white font-semibold">
            <tr>
              <th className="h-full px-3 py-2 text-center">Agent ID / Name</th>
              <th className="px-3 py-2 text-center">Client Name</th>
              <th className="px-3 py-2 text-center">Project Name</th>
              <th className="px-3 py-2 text-center">Generate Invoice</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-12 ">
              {/* Agent column with compact dropdown */}
              <td className="px-2 py-1 border " ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search Agent"
                  value={agentInput}
                  onChange={(e) => handleAgentInputChange(e.target.value)}
                  onFocus={() => setDropdownOpen(true)}
                  className="w-full border rounded px-2 py-1"
                />
                {dropdownOpen && filteredAgents.length > 0 && !selectedAgent && (
                  <ul className="absolute bg-white border w-50 max-h-48 overflow-y-auto shadow-md z-20 rounded mt-1">
                    {filteredAgents.map((agent) => (
                      <li
                        key={agent.id}
                        className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleAgentSelect(agent)}
                      >
                        {agent.name} ({agent.id})
                      </li>
                    ))}
                  </ul>
                )}
              </td>

              {/* Client dropdown */}
              <td className="px-3 py-1 border">
                <select
                  value={selectedClient?.id || ''}
                  onChange={(e) => handleClientChange(e.target.value)}
                  disabled={!selectedAgent}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Client</option>
                  {selectedAgent?.clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </td>


              {/* Project dropdown */}
              <td className="px-3 py-1 border">
                <select
                  value={selectedProject?.id || ''}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  disabled={!selectedClient}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Select Project</option>
                  {selectedClient?.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </td>
              {/* Generate Invoice Button */}
              <td className="px-3 py-1 border text-center">
                <button
                  onClick={handleInvoiceClick}
                  disabled={!(selectedAgent && selectedClient && selectedProject)}
                  className={`px-4 py-1 rounded text-white ${
                    selectedAgent && selectedClient && selectedProject
                      ? 'bg-red-500 hover:bg-red-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Invoice
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Generated Invoices List */}
      {invoicesList.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Generated Invoices</h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-[#295A47] text-white font-semibold">
                <tr>
                  <th className="px-3 py-2">Invoice ID</th>
                  <th className="px-3 py-2">Agent</th>
                  <th className="px-3 py-2">Client</th>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Due Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Download PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoicesList.map((invoice, index) => {
                  const invoiceId = `INV-${String(index + 1).padStart(3, '0')}`;
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{invoiceId}</td>
                      <td className="px-3 py-2">{invoice.agentDetails.name}</td>
                      <td className="px-3 py-2">{invoice.clientDetails.name}</td>
                      <td className="px-3 py-2">{invoice.propertyDetails.name}</td>
                    <td className="px-3 py-2">₹{invoice.due.toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2">{invoice.invoiceDate}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => generatePDF(invoice, invoiceId)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-900 text-xs"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Previous Invoices Modal */}
      {showPreviousInvoices && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-800 to-emerald-900 text-white p-6 rounded-t-lg">
              <h3 className="text-3xl font-bold text-center">Previous Invoices for {selectedProject?.name}</h3>

            </div>
            <div className="p-8">
              {invoicesList.filter(invoice => invoice.propertyDetails.name === selectedProject?.name).length > 0 ? (
                <div className=" overflow-x-auto bg-white rounded-lg shadow-md">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#D7E7D0] text-red font-semibold">
                      <tr>
                        <th className="px-3 py-2">Invoice ID</th>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2">Agent's Share</th>
                        <th className="px-3 py-2">Paid</th>
                        <th className="px-3 py-2">Due</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Download PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesList
                        .filter(invoice => invoice.propertyDetails.name === selectedProject?.name)
                        .map((invoice, index) => {
                          const invoiceId = `INV-${String(invoicesList.indexOf(invoice) + 1).padStart(3, '0')}`;
                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="px-3 py-2">{invoiceId}</td>
                              <td className="px-3 py-2">{invoice.invoiceDate}</td>
                              <td className="px-3 py-2">{invoice.invoiceTime}</td>
                              <td className="px-3 py-2">₹{invoice.agentShare.toLocaleString()}</td>
                              <td className="px-3 py-2">₹{invoice.paid.toLocaleString()}</td>
                              <td className="px-3 py-2">₹{invoice.due.toLocaleString()}</td>
                              <td className="px-3 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  invoice.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {invoice.paymentStatus}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() => generatePDF(invoice, invoiceId)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                >
                                  PDF
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">No previous invoices found for this project.</p>
              )}
            </div>
            <div className="bg-gray-100 p-6 rounded-b-lg flex justify-end">
              <button
                onClick={() => setShowPreviousInvoices(false)}
                className={`px-2 py-1 rounded-xl text-white ${selectedAgent && selectedClient && selectedProject
                            ? 'bg-red-500 hover:bg-green-900'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {modalOpen && invoiceData && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#D7E7D0] rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="bg-[#295A47] text-white p-6 rounded-t-lg flex justify-between items-center">
              <h3 className="text-3xl font-bold text-center flex-1">Invoice</h3>
              
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="text-white text-3xl font-bold hover:text-gray-300 ml-auto"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="p-8  space-y-6 text-gray-900">
              {/* Top Section: Biller & Client */}
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="md:w-1/2 mb-4 md:mb-0">
                  <h4 className="font-semibold text-lg mb-2">Biller Details</h4>
                  <p>{invoiceData.billerDetails.name}</p>
                  <p>{invoiceData.billerDetails.address}</p>
                  <p>{invoiceData.billerDetails.contact}</p>
                </div>
                <div className="pl-20 md:w-1/2">
                  <h4 className="font-semibold text-lg mb-2">Agent Details</h4>
                  <p>{invoiceData.agentDetails.name} (ID: {invoiceData.agentDetails.id})</p>
                  <p>{invoiceData.agentDetails.contact}</p>
                </div>
              </div>

              {/* Property & Agent Details */}
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="md:w-1/2 mb-4 md:mb-0">
                  <h4 className="font-semibold text-lg mb-2">Property Details</h4>
                  <p>{invoiceData.propertyDetails.name}</p>
                </div>
                <div className="pl-20 md:w-1/2">
                  <h4 className="font-semibold text-lg mb-2">Client Details</h4>
                  <p>{invoiceData.clientDetails.name}</p>
                  <p>{invoiceData.clientDetails.contact}</p>
                </div> 
              </div>

              {/* Financial Details Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-medium">Total Estimate</td>
                      <td className="px-4 py-2">₹{invoiceData.totalEstimate.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-medium">Agent's Share</td>
                      <td className="px-4 py-2">₹{invoiceData.agentShare.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-medium">Paid</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={invoiceData.paid}
                          onChange={(e) => handlePaidChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter paid amount"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="px-4 py-2 font-medium">Due</td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        <span>₹{invoiceData.due.toLocaleString()}</span>
                        <button
                          onClick={() => setShowPreviousInvoices(true)}
                          className={`px-2 py-1 rounded-xl text-white ${selectedAgent && selectedClient && selectedProject
                            ? 'bg-red-500 hover:bg-green-900'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        >
                          View Previous
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium">Payment Status</td>
                      <td className="px-4 py-2">
                        <span className={`${invoiceData.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                          {invoiceData.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Invoice Date & Time */}
              <div className="flex justify-between text-sm text-gray-700">
                <div>
                  <span className="font-medium">Invoice Date:</span> 
                  {new Date(invoiceData.invoiceDate).toLocaleDateString('en-GB')} {/* Forces DD/MM/YYYY */}
                </div>
                
                <div>
                  <span className="font-medium">Invoice Time:</span> {invoiceData.invoiceTime}
                </div>
              </div>
            </div>
            {/* Uploaded Receipt Preview with Delete Option */}
{uploadedImage && (
  <div className="relative flex justify-center mb-4">
    {/* Delete (X) button */}
    <button
      onClick={() => setUploadedImage(null)}
      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
      aria-label="Remove uploaded image"
    >
      &times;
    </button>

    {/* Image */}
    <img
      src={uploadedImage}
      alt="Uploaded Receipt"
      className="max-h-64 w-auto rounded-lg border border-gray-300 shadow-md object-contain"
    />
  </div>
)}


                        
            {/* Footer Buttons */}
            <div className="bg-[#D7E7D0] p-6 rounded-b-lg flex justify-end space-x-4">
              <label
                htmlFor="receiptUpload"
                className="px-2 ml-100 py-1 bg-[#295A47] text-white rounded-3xl hover:bg-green-900 cursor-pointer transition duration-200"
              >
                Upload Receipt
              </label>
              <input
                type="file"
                id="receiptUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log('Receipt uploaded:', file.name);
                  }
                }}
              />
              <button
                onClick={handleClose}
                className="px-4 py-1 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition duration-200"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className={`px-4 py-1 rounded-2xl text-white ${
                    selectedAgent && selectedClient && selectedProject
                      ? 'bg-red-500 hover:bg-green-900'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      
    </div>
  );
};

export default InvoicesTable;
