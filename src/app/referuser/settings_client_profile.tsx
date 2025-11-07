// "use client";

// import React, { useState } from "react";
// import { Upload } from "lucide-react";

// const ClientProfile: React.FC = () => {
//   const [profileImage, setProfileImage] = useState<string | null>(null);

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (e) => setProfileImage(e.target?.result as string);
//       reader.readAsDataURL(event.target.files[0]);
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h2 className="text-xl font-semibold text-gray-700 mb-6"> Profile</h2>

//       {/* Profile Header */}
//       <div className="flex items-start gap-8 bg-white p-6 rounded-lg shadow-sm">
//         {/* Profile Image Upload */}
//         <div className="relative flex flex-col items-center">
//           <div className="w-32 h-32 rounded-full overflow-hidden border">
//             {profileImage ? (
//               <img
//                 src={profileImage}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <img
//                 src="/profile.png"
//                 alt="Profile"
//                 className="w-full h-full object-contain"
//               />
//             )}
//           </div>
//           <label className="absolute bottom-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
//             <Upload className="w-4 h-4" />
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImageUpload}
//             />
//           </label>
//         </div>

//         {/* Profile Form */}
//         <div className="grid grid-cols-2 gap-6 flex-1">
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Brand Name</label>
//             <input
//               type="text"
//               placeholder="Brand Name"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Company Name*</label>
//             <input
//               type="text"
//               placeholder="Company Name"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">
//               Represented by*
//             </label>
//             <input
//               type="text"
//               placeholder="Representer Full Name"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Designation</label>
//             <input
//               type="text"
//               placeholder="Designation"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Company Address Section */}
//       <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
//         <h3 className="bg-gray-100 px-3 py-2 font-medium text-gray-700 rounded">
//           Company Address*
//         </h3>
//         <div className="grid grid-cols-2 gap-6 mt-4">
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">
//               Street/Building Details*
//             </label>
//             <input
//               type="text"
//               placeholder="Street/Building Details"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">
//               Bylane/Locality/Area*
//             </label>
//             <input
//               type="text"
//               placeholder="Bylane/Locality/Area"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">State*</label>
//             <input
//               type="text"
//               placeholder="State"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">City*</label>
//             <input
//               type="text"
//               placeholder="City"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Pincode*</label>
//             <input
//               type="text"
//               placeholder="Pincode"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Company Contact Details */}
//       <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
//         <h3 className="bg-gray-100 px-3 py-2 font-medium text-gray-700 rounded">
//           Company Contact Details
//         </h3>
//         <div className="grid grid-cols-2 gap-6 mt-4">
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Phone</label>
//             <div className="flex border rounded-md overflow-hidden">
//               <span className="bg-gray-100 px-3 py-2 text-gray-700">+91</span>
//               <input
//                 type="text"
//                 placeholder="Phone Number"
//                 className="p-2 flex-1 outline-none"
//               />
//             </div>
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Email*</label>
//             <div className="flex items-center gap-2">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="border rounded-md w-full p-2"
//               />
//               <span className="bg-orange-400 text-white text-xs px-2 py-1 rounded">
//                 VERIFIED
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Company KYC Details */}
//       <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
//         <h3 className="bg-gray-100 px-3 py-2 font-medium text-gray-700 rounded">
//           Company KYC Details
//         </h3>
//         <div className="grid grid-cols-2 gap-6 mt-4">
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">PAN</label>
//             <input
//               type="text"
//               placeholder="Enter PAN Number"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Upload PAN</label>
//             <input
//               type="file"
//               accept=".jpg,.png,.pdf"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">GST</label>
//             <input
//               type="text"
//               placeholder="Enter GST Number"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">Upload GST</label>
//             <input
//               type="file"
//               accept=".jpg,.png,.pdf"
//               className="border rounded-md w-full p-2"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Submit Button */}
//       <div className="flex justify-center mt-10">
//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md transition">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClientProfile;

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
}

const ClientPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setClients((prev) => [...prev, formData]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    setShowForm(false);
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
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Client Details Management
      </h1>

      {/* Add Client Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
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
                className="bg-green-600 text-red px-6 py-2 rounded-md shadow hover:bg-green-700 transition"
              >
                Submit Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Client Table */}
      <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Client Records
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-100">
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
