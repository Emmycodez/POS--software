"use client"

import { useState } from "react";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(3); // Example unread notifications

  return (
    <button className="relative cursor-pointer border-1 border-gray-500">
      <Bell className="w-7 h-7 text-gray-700 dark:text-gray-200" />
      {notifications > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {notifications}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
