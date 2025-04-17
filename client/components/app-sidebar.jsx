"use client";

import {
  Bolt,
  ClipboardList,
  GalleryVerticalEnd,
  House,
  MapPinned,
  Package,
  PackageSearch,
  ShoppingBag,
  ShoppingCart,
  Siren,
  Users,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { appName } from "@/app/constants";
import LocationSwitcher from "@/app/site/dashboard/_components/LocationSwitcher";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/site/dashboard",
      icon: House,
      isActive: true,
    },
    {
      title: "Employees",
      url: "/site/dashboard/employees",
      icon: UsersRound,
    },
    {
      title: "Inventory",
      url: "/site/dashboard/inventory",
      icon: PackageSearch,
      items: [
        {
          title: "Products",
          url: "/site/dashboard/inventory/products",
        },
        {
          title: "Inventory",
          url: "/site/dashboard/inventory",
        },
      ],
    },
    {
      title: " Stock Alerts",
      url: "/site/dashboard/stock-alerts",
      icon: Siren,
    },
    {
      title: "Transactions",
      url: "/site/dashboard/transactions",
      icon: ClipboardList,
    },
    {
      title: "POS",
      url: "/site/dashboard/pos",
      icon: ShoppingCart,
    },
    {
      title: "Suppliers",
      url: "/site/dashboard/suppliers",
      icon: Users,
    },
    {
      title: "Orders",
      url: "/site/dashboard/orders",
      icon: ShoppingBag,
      items: [
        {
          title: "Invoice",
          url: "/site/dashboard/orders/invoice",
        },
        {
          title: "Receipt",
          url: "/site/dashboard/orders/receipt",
        },
      ],
    },
    {
      title: "Settings",
      url: "/site/dashboard/settings",
      icon: Bolt,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none py-4">
                  <span className="font-semibold text-gray-900">{appName}</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          {/* <SidebarOptInForm /> */}
          {/* <SidebarUpgrade/> */}
        </div>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
