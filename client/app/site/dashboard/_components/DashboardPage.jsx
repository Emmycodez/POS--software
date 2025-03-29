"use client";
import {
  Bell,
  Download,
  LineChart,
  Menu,
  Package,
  PieChart,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DatePickerWithRange } from "@/components/date-range-picker";

import { SalesFinancialSection } from "./sales-financial-section"; 
import { InventorySection } from "./inventory-section";
import { AlertsSection } from "./alerts-section";
import { TransactionsSection } from "./transactions-section";
import { CustomerSection } from "./customer-section";
import { AnalyticsSection } from "./analytics-section";

export function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b px-2 py-4">
                <Package className="mr-2 h-6 w-6" />
                <h2 className="text-lg font-semibold">Retail Dashboard</h2>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-2 p-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="/">
                    <Package className="mr-2 h-5 w-5" />
                    Dashboard
                  </a>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="/reports">
                    <LineChart className="mr-2 h-5 w-5" />
                    Reports
                  </a>
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Retail Dashboard</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <DatePickerWithRange className="hidden md:flex" />
          <Button variant="outline" size="icon">
            <Download className="h-5 w-5" />
            <span className="sr-only">Export Data</span>
          </Button>
        </div>
      </header>
      <div className="flex w-full">
        {/* <aside className="hidden border-r md:block">
          <nav className="grid gap-2 p-4">
            <Button variant="default" className="justify-start" asChild>
              <a href="/">
                <Package className="mr-2 h-5 w-5" />
                Dashboard
              </a>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="/reports">
                <LineChart className="mr-2 h-5 w-5" />
                Reports
              </a>
            </Button>
          </nav>
        </aside> */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="md:hidden mb-4">
            <DatePickerWithRange />
          </div>

          <div className="grid gap-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Dashboard Overview
            </h2>

            {/* Sales & Financial Overview */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <LineChart className="mr-2 h-5 w-5" />
                Sales & Financial Overview
              </h3>
              <SalesFinancialSection />
            </section>

            {/* Inventory Insights */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventory Insights
              </h3>
              <InventorySection />
            </section>

            {/* Alerts & Notifications */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Alerts & Notifications
              </h3>
              <AlertsSection />
            </section>

            {/* POS & Transactions Summary */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                POS & Transactions Summary
              </h3>
              <TransactionsSection />
            </section>

            {/* Customer Insights */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Customer Insights
              </h3>
              <CustomerSection />
            </section>

            {/* Reports & Analytics */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Reports & Analytics
              </h3>
              <AnalyticsSection />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
