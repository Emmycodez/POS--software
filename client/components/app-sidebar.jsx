"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bolt,
  BookOpen,
  Bot,
  ChartBarStacked,
  Command,
  Frame,
  GalleryVerticalEnd,
  Gem,
  House,
  Map,
  MapPinned,
  PackageSearch,
  PieChart,
  QrCode,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Siren,
  Users,
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
      title: "Home",
      url: "/site/dashboard",
      icon: House,
      isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Employees",
      url: "/site/dashboard/employees",
      icon: UsersRound,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
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
          title: "Categories",
          url: "/site/dashboard/inventory/categories",
        },
      ],
    },
    // {
    //   title: "Categories",
    //   url: "/site/dashboard/categories",
    //   icon: ChartBarStacked,
    // },
    // {
    //   title: "Settings",
    //   url: "/site/dashboard/settings",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Alerts",
      url: "/site/dashboard/alerts",
      icon: Siren,
    },
    {
      title: "Todays Deliveries",
      url: "/site/dashboard/todaysdeliveries",
      icon: MapPinned,
    },
    {
      title: "POS",
      url: "/site/dashboard/pos",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "/site/dashboard/customers",
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
