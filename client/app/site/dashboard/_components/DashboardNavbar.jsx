import NotificationBell from "./NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const DashboardNavbar = () => {
  return (
    <nav className="border-b px-4 py-2 bg-blue-50 h-14">
      <div className="flex items-center justify-between space-x-4 ">
        {/* Dummy DIV */}
        <div className="w-12" />
        {/* First DIV */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* second DIV */}
        <div className="flex items-center justify-center gap-2">
          <NotificationBell />
          <Avatar className="hidden md:block">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
