// 'use client';

// import React, { useState } from 'react';
// import { ChevronDown, CreditCard, Smartphone, ArrowLeftRight } from 'lucide-react';

// const BankDetailsPage = () => {
//   const [mode, setMode] = useState<'bank' | 'upi'>('bank');
//   const [formData, setFormData] = useState<any>({});
//   const [submitted, setSubmitted] = useState(false);

//   // handle input change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // handle submit
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };

//   // reset
//   const handleReset = () => {
//     setFormData({});
//     setSubmitted(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
//         {!submitted ? (
//           <>
//             <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
//               Enter Your Payment Details
//             </h2>

//             {/* Dropdown for type selection */}
//             <div className="mb-6">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Choose Detail Type
//               </label>
//               <div className="relative">
//                 <select
//                   value={mode}
//                   onChange={(e) => setMode(e.target.value as 'bank' | 'upi')}
//                   className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="bank">Bank Account Details</option>
//                   <option value="upi">UPI Details</option>
//                 </select>
//                 <ChevronDown className="absolute right-3 top-3 text-gray-400" size={18} />
//               </div>
//             </div>

//             {/* Conditional Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {mode === 'bank' ? (
//                 <>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">Account Holder Name</label>
//                     <input
//                       type="text"
//                       name="holderName"
//                       value={formData.holderName || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">Bank Name</label>
//                     <input
//                       type="text"
//                       name="bankName"
//                       value={formData.bankName || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">Account Number</label>
//                     <input
//                       type="text"
//                       name="accountNumber"
//                       value={formData.accountNumber || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">IFSC Code</label>
//                     <input
//                       type="text"
//                       name="ifsc"
//                       value={formData.ifsc || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">UPI ID</label>
//                     <input
//                       type="text"
//                       name="upiId"
//                       value={formData.upiId || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                       placeholder="example@upi"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">Account Holder Name</label>
//                     <input
//                       type="text"
//                       name="upiName"
//                       value={formData.upiName || ''}
//                       onChange={handleChange}
//                       required
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-600 font-medium mb-1">UPI QR Code</label>
//                     <input
//                       type="file"
//                       name="upiQrCode"
//                       accept="image/*"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         setFormData({
//                           ...formData,
//                           upiQrCode: file,
//                         });
//                       }}
//                       className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </>
//               )}

//               {/* Submit button */}
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
//               >
//                 Submit Details
//               </button>
//             </form>
//           </>
//         ) : (
//           <>
//             {/* Hero Section After Submission */}
//             <div className="flex flex-col items-center text-center">
//               <div className="bg-blue-100 rounded-full p-4 mb-4">
//                 {mode === 'bank' ? (
//                   <CreditCard className="w-10 h-10 text-blue-600" />
//                 ) : (
//                   <Smartphone className="w-10 h-10 text-blue-600" />
//                 )}
//               </div>
//               <h3 className="text-2xl font-semibold text-gray-700 mb-2">
//                 Payment Details Saved
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {mode === 'bank' ? (
//                   <>
//                     <strong>{formData.holderName}</strong> — {formData.bankName}
//                     <br />
//                     A/C: {formData.accountNumber} <br />
//                     IFSC: {formData.ifsc}
//                   </>
//                 ) : (
//                   <>
//                     <strong>{formData.upiName}</strong> <br />
//                     UPI ID: {formData.upiId}
//                   </>
//                 )}
//               </p>

//               {/* Change Button */}
//               <button
//                 onClick={handleReset}
//                 className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//               >
//                 <ArrowLeftRight size={18} />
//                 Change Details
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BankDetailsPage;




"use client";
import React, { useState } from "react";

const BankDetailsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState("Bank Account Details");

  // ✅ Always initialize all fields (never undefined)
  const [formData, setFormData] = useState({
    accountHolderName: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiQr: "",
  });

  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, upiQr: fileURL }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  const handleReset = () => {
    setFormData({
      accountHolderName: "",
      upiId: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiQr: "",
    });
    setSubmittedData(null);
  };

  const displayData = submittedData || formData;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center text-[#295A47] mb-8">
        Upload Your Bank Details
      </h1>

      {/* Select Type */}
      <div className="mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-72 shadow-sm focus:ring-2 focus:ring-[#295A47]"
        >
          <option>Bank Account Details</option>
          <option>UPI Details</option>
        </select>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {selectedType}
        </h2>

        {selectedType === "Bank Account Details" ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Account Holder Name
              </label>
              <input
                name="accountHolderName"
                type="text"
                value={formData.accountHolderName}
                onChange={handleChange}
                placeholder="Enter account holder name"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Bank Name
              </label>
              <input
                name="bankName"
                type="text"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Account Number
              </label>
              <input
                name="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                IFSC Code
              </label>
              <input
                name="ifscCode"
                type="text"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Account Holder Name
              </label>
              <input
                name="accountHolderName"
                type="text"
                value={formData.accountHolderName}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
              <input
                name="upiId"
                type="text"
                value={formData.upiId}
                onChange={handleChange}
                placeholder="example@upi"
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Upload UPI QR Code
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                placeholder="example@upi"
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="bg-[#295A47] text-white px-6 py-2 rounded-md hover:bg-[#1e3d32] transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Table (Always Visible) */}
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Bank Details Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-center">
            <thead className="bg-[#295A47] text-white">
              <tr>
                <th className="px-4 py-2 border">Sl No</th>
                <th className="px-4 py-2 border">Account Holder Name</th>
                <th className="px-4 py-2 border">UPI ID</th>
                <th className="px-4 py-2 border">Bank Name</th>
                <th className="px-4 py-2 border">Account Number</th>
                <th className="px-4 py-2 border">IFSC Code</th>
                <th className="px-4 py-2 border">UPI QR Code</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 border">1</td>
                <td className="px-4 py-2 border italic text-gray-500">
                  {displayData.accountHolderName || "null"}
                </td>
                <td className="px-4 py-2 border italic text-gray-500">
                  {displayData.upiId || "null"}
                </td>
                <td className="px-4 py-2 border italic text-gray-500">
                  {displayData.bankName || "null"}
                </td>
                <td className="px-4 py-2 border italic text-gray-500">
                  {displayData.accountNumber || "null"}
                </td>
                <td className="px-4 py-2 border italic text-gray-500">
                  {displayData.ifscCode || "null"}
                </td>
                <td className="px-4 py-2 border italic text-gray-500">
                  {displayData.upiQr ? (
                    <a
                      href={displayData.upiQr}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "null"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPage;








































































































































































































































// 'use client';

// import React, { useState } from 'react';
// import { ChevronDown, Upload, X } from 'lucide-react';

// const BankDetailsPage = () => {
//   const [mode, setMode] = useState<'bank' | 'upi'>('bank');
//   const [formData, setFormData] = useState<any>({
//     holderName: '',
//     upiId: '',
//     bankName: '',
//     accountNumber: '',
//     ifsc: '',
//     upiQr: '',
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [qrPreview, setQrPreview] = useState<string | null>(null);
//   const [showQr, setShowQr] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setFormData({ ...formData, upiQr: imageUrl });
//       setQrPreview(imageUrl);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };

//   const handleReset = () => {
//     setFormData({
//       holderName: '',
//       upiId: '',
//       bankName: '',
//       accountNumber: '',
//       ifsc: '',
//       upiQr: '',
//     });
//     setSubmitted(false);
//     setQrPreview(null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* Header */}
//       <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
//         Upload Your Bank Details
//       </h1>

//       {/* Dropdown for type selection */}
//       <div className="max-w-lg mx-auto mb-8">
//         <label className="block text-gray-600 font-medium mb-2">
//           Select Type
//         </label>
//         <div className="relative">
//           <select
//             value={mode}
//             onChange={(e) => setMode(e.target.value as 'bank' | 'upi')}
//             className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="bank">Bank Account Details</option>
//             <option value="upi">UPI Details</option>
//           </select>
//           <ChevronDown className="absolute right-3 top-3 text-gray-400" size={18} />
//         </div>
//       </div>

//       {/* Form Section */}
//       {!submitted && (
//         <form
//           onSubmit={handleSubmit}
//           className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow space-y-4"
//         >
//           <div>
//             <label className="block text-gray-600 font-medium mb-1">
//               Account Holder Name
//             </label>
//             <input
//               type="text"
//               name="holderName"
//               value={formData.holderName}
//               onChange={handleChange}
//               required
//               className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {mode === 'bank' && (
//             <>
//               <div>
//                 <label className="block text-gray-600 font-medium mb-1">
//                   Bank Name
//                 </label>
//                 <input
//                   type="text"
//                   name="bankName"
//                   value={formData.bankName}
//                   onChange={handleChange}
//                   required
//                   className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-600 font-medium mb-1">
//                   Account Number
//                 </label>
//                 <input
//                   type="text"
//                   name="accountNumber"
//                   value={formData.accountNumber}
//                   onChange={handleChange}
//                   required
//                   className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-600 font-medium mb-1">
//                   IFSC Code
//                 </label>
//                 <input
//                   type="text"
//                   name="ifsc"
//                   value={formData.ifsc}
//                   onChange={handleChange}
//                   required
//                   className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </>
//           )}

//           {mode === 'upi' && (
//             <>
//               <div>
//                 <label className="block text-gray-600 font-medium mb-1">
//                   UPI ID
//                 </label>
//                 <input
//                   type="text"
//                   name="upiId"
//                   value={formData.upiId}
//                   onChange={handleChange}
//                   required
//                   className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//                   placeholder="example@upi"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-600 font-medium mb-1">
//                   Upload UPI QR
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <label className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md cursor-pointer hover:bg-blue-700">
//                     <Upload size={16} />
//                     Upload QR
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                   {qrPreview && (
//                     <img
//                       src={qrPreview}
//                       alt="QR Preview"
//                       className="w-12 h-12 rounded-md border cursor-pointer"
//                       onClick={() => setShowQr(true)}
//                     />
//                   )}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
//           >
//             Save Details
//           </button>
//         </form>
//       )}

//       {/* Table Section */}
//       {submitted && (
//         <div className="max-w-5xl mx-auto mt-10 bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-700">Saved Bank Details</h2>
//             <button
//               onClick={handleReset}
//               className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//             >
//               Change Details
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="p-3 border">Account Holder Name</th>
//                   <th className="p-3 border">UPI ID</th>
//                   <th className="p-3 border">Bank Name</th>
//                   <th className="p-3 border">Account Number</th>
//                   <th className="p-3 border">IFSC Code</th>
//                   <th className="p-3 border">UPI QR</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="p-3 border">
//                     {formData.holderName || <i>null</i>}
//                   </td>
//                   <td className="p-3 border">
//                     {formData.upiId || <i>null</i>}
//                   </td>
//                   <td className="p-3 border">
//                     {formData.bankName || <i>null</i>}
//                   </td>
//                   <td className="p-3 border">
//                     {formData.accountNumber || <i>null</i>}
//                   </td>
//                   <td className="p-3 border">
//                     {formData.ifsc || <i>null</i>}
//                   </td>
//                   <td className="p-3 border text-center">
//                     {formData.upiQr ? (
//                       <img
//                         src={formData.upiQr}
//                         alt="UPI QR"
//                         className="w-10 h-10 mx-auto cursor-pointer"
//                         onClick={() => setShowQr(true)}
//                       />
//                     ) : (
//                       <i>null</i>
//                     )}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* UPI QR Popup */}
//       {showQr && qrPreview && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg relative">
//             <button
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//               onClick={() => setShowQr(false)}
//             >
//               <X size={18} />
//             </button>
//             <img
//               src={qrPreview}
//               alt="UPI QR"
//               className="w-60 h-60 object-contain rounded-lg"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BankDetailsPage;
