"use client";
import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";

interface FormDataType {
  accountHolderName: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiQr: string;
}

const BankDetailsPage: React.FC = () => {
  const initialFormData: FormDataType = {
    accountHolderName: "",
    upiId: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiQr: "",
  };

  const [selectedType, setSelectedType] = useState<"Bank Account Details" | "UPI Details">(
    "Bank Account Details"
  );
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [submittedData, setSubmittedData] = useState<FormDataType | null>(null);

  // Handle text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, upiQr: fileURL }));
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for Bank Account Details
    if (selectedType === "Bank Account Details") {
      if (!formData.accountHolderName || !formData.bankName || !formData.accountNumber || !formData.ifscCode) {
        alert("Please fill in all required fields for Bank Account Details.");
        return;
      }
    }

    // Validation for UPI Details
    if (selectedType === "UPI Details") {
      if (!formData.accountHolderName || !formData.upiId || !formData.upiQr) {
        alert("Please fill in all required fields for UPI Details, including uploading the QR code.");
        return;
      }
    }

    setSubmittedData({ ...formData });
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setSubmittedData(null);
  };

  // Ensure formData always has all keys defined (extra safety)
  useEffect(() => {
    setFormData((prev) => ({ ...initialFormData, ...prev }));
  }, [selectedType]);

  const displayData = submittedData ?? formData;

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center text-[#295A47] mb-8">
        Upload Your Bank Details
      </h1>

      {/* Select Type */}
      <div className="mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as "Bank Account Details" | "UPI Details")}
          className="border border-gray-300 rounded-md p-2 w-72 shadow-sm focus:ring-2 focus:ring-[#295A47]"
        >
          <option value="Bank Account Details">Bank Account Details</option>
          <option value="UPI Details">UPI Details</option>
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
            <InputField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Enter account holder name"
              required
            />
            <InputField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Enter bank name"
              required
            />
            <InputField
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
              required
            />
            <InputField
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
              required
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <InputField
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
            <InputField
              label="UPI ID"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="example@upi"
              required
            />
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Upload UPI QR Code<span className="text-red-500">*</span>
              </label>
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-md overflow-hidden flex items-center justify-center">
                {formData.upiQr ? (
                  <img
                    src={formData.upiQr}
                    alt="UPI QR Code"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-xs">Upload QR</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
              </div>
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

      {/* Table */}
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

// ✅ Reusable InputField component
interface InputFieldProps {
  label: string;
  name: keyof FormDataType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type="text"
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full border rounded-md p-2"
    />
  </div>
);

export default BankDetailsPage;
