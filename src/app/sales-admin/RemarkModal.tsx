"use client";

import React from "react";

interface Remark {
  id: number;
  date: string;
  time: string;
  comment: string;
}

interface RemarkModalProps {
  isOpen: boolean;
  remarks: Remark[];
  currentComment: string;
  setCurrentComment: (comment: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const RemarkModal: React.FC<RemarkModalProps> = ({
  isOpen,
  remarks,
  currentComment,
  setCurrentComment,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50  bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-4xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-[#295A47]">Lead Remarks</h2>

        {/* Previous remarks list */}
        {remarks.length > 0 ? (
          <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white">
            {remarks.map((r) => (
              <div
                key={r.id}
                className="border-b border-gray-100 p-2 text-sm text-gray-700"
              >
                <p className="font-medium">
                  {r.date} | {r.time}
                </p>
                <p className="italic">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4 text-sm italic">No remarks yet.</p>
        )}

        {/* New remark input */}
        <textarea
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder="Enter your remark..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
          rows={4}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-[#295A47] text-white rounded-lg hover:bg-[#3a7d5f]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemarkModal;
