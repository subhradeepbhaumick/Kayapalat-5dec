

"use client";

import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

interface Client {
  name: string;
  email?: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date: string;
}

const ClientPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<Client>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const newClient = { ...formData, date: new Date().toLocaleDateString('en-GB') };
    setClients((prev) => [...prev, newClient]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      date: "",
    });
    setShowForm(false);
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      date: "",
    });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
        Client Details Management
      </h1>

      {/* Add Client Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-2 py-2 rounded-2xl hover:bg-gray-400 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Client
        </button>
      </div>

      {/* Client Form */}
      {showForm && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 relative">
          <button
            onClick={handleCancel}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Add Client Details
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Client Name"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID (optional)"
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 col-span-1 md:col-span-2"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City / Town"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              required
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-red-500 text-white px-3 py-2 rounded-2xl hover:bg-gray-400 transition"
              >
                Submit Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Congratulations Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h2>
            <p className="text-gray-700 mb-6">You have successfully referred a new client.</p>
            <button
              onClick={closePopup}
              className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Client Table */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Client Records
        </h2>

        <div className="overflow-x-auto">
          <table className=" min-w-full border border-gray-300">
            <thead className="bg-[#d7e7d0]">
              <tr>
                <th className="border px-4 py-2 text-left">Sl No</th>
                <th className="border px-4 py-2 text-left">Client Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">WhatsApp</th>
                <th className="border px-4 py-2 text-left">Address</th>
                <th className="border px-4 py-2 text-left">City</th>
                <th className="border px-4 py-2 text-left">State</th>
                <th className="border px-4 py-2 text-left">Pincode</th>
                <th className="border px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                  <td className="border px-4 py-2 text-center italic text-gray-400">null</td>
                </tr>
              ) : (
                clients.map((client, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{client.name}</td>
                    <td className="border px-4 py-2">{client.email || <span className="italic text-gray-400">null</span>}</td>
                    <td className="border px-4 py-2">{client.phone}</td>
                    <td className="border px-4 py-2">{client.whatsapp}</td>
                    <td className="border px-4 py-2">{client.address}</td>
                    <td className="border px-4 py-2">{client.city}</td>
                    <td className="border px-4 py-2">{client.state}</td>
                    <td className="border px-4 py-2">{client.pincode}</td>
                    <td className="border px-4 py-2">{client.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
