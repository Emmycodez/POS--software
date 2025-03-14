"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  AlertTriangle,
  ClipboardList,
  Users,
  BarChart2,
  Settings,
  Siren,
  Store,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/site/dashboard", icon: Home },
  { name: "P.O.S", href: "/site/dashboard/pos", icon: Store },
  { name: "Inventory", href: "/site/dashboard/inventory", icon: Package },
  {
    name: "Products",
    href: "/site/dashboard/inventory/products",
    icon: ShoppingCart,
  },
  { name: "Stock Alerts", href: "/site/dashboard/stock-alerts", icon: Siren },
  { name: "Transactions", href: "/site/dashboard/transactions", icon: ClipboardList },

  { name: "Suppliers", href: "/site/dashboard/suppliers", icon: Users },
  { name: "Reports", href: "/site/dashboard/reports", icon: BarChart2 },
  { name: "Settings", href: "/site/dashboard/settings", icon: Settings },
];

export function V0Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-violet-800 border-r text-white">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-2xl font-semibold">InvenTrack</span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-100 hover:text-violet-800 ${
                    isActive ? "bg-gray-100 text-violet-800" : "text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
