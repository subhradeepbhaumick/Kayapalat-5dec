'use client';

import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsTab = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#295A47] mb-4">
          Notifications
        </h1>
        <p className="text-gray-600 text-lg">
          Stay updated with the latest notifications.
        </p>
      </div>
      <div className="text-center py-12">
        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Notifications Section</h3>
        <p className="text-gray-500">Notification features coming soon.</p>
      </div>
    </>
  );
};

export default NotificationsTab;
