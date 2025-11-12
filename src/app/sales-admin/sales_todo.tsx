'use client';

import React from 'react';
import { ClipboardList } from 'lucide-react';

const TodoTab = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">
          To Do List
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your tasks and priorities.
        </p>
      </div>
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">To Do Section</h3>
        <p className="text-gray-500">Task management features coming soon.</p>
      </div>
    </>
  );
};

export default TodoTab;
