"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { alertsColumns } from "./AlertsColumns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Mail, MessageSquare } from "lucide-react";
import { ResponsiveDataTable } from "./responsive-data-table";
import { NotificationDetailsModal } from "./notifications-details-modal";
import { updateAlert } from "@/actions/serverActions";

export default function AlertsTable({ alertData }) {
  const [data, setData] = useState(alertData);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Function to mark notification as read
  const markAsRead = async (id) => {
    const status = true;
    await updateAlert(status, id);
    // setData((prevData) =>
    //   prevData.map((alert) =>
    //     alert.id === id ? { ...alert, read: true } : alert
    //   )
    // );
  };
  const viewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  };

  // Count unread notifications
  const unreadCount = data.filter((alert) => !alert.read).length;
  const emailAlerts = data.filter((alert) => alert.type.includes("email"));
  const smsAlerts = data.filter((alert) => alert.type.includes("sms"));

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            View all stock alerts sent to you via email and SMS
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Alerts</CardTitle>
            <CardDescription>All notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{data.length}</div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Email Alerts</CardTitle>
            <CardDescription>Notifications sent via email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{emailAlerts.length}</div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">SMS Alerts</CardTitle>
            <CardDescription>Notifications sent via SMS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{smsAlerts.length}</div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full overflow-x-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto flex flex-wrap">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ResponsiveDataTable
              columns={alertsColumns(markAsRead, viewDetails)}
              data={data}
            />
          </TabsContent>
          <TabsContent value="unread">
            <ResponsiveDataTable
              columns={alertsColumns(markAsRead, viewDetails)}
              data={data.filter((alert) => !alert.read)}
            />
          </TabsContent>
          <TabsContent value="email">
            <ResponsiveDataTable
              columns={alertsColumns(markAsRead, viewDetails)}
              data={data.filter((alert) => alert.type.includes("email"))}
            />
          </TabsContent>
          <TabsContent value="sms">
            <ResponsiveDataTable
              columns={alertsColumns(markAsRead, viewDetails)}
              data={data.filter((alert) => alert.type.includes("sms"))}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* NOtification Modal */}
      <NotificationDetailsModal
        notification={selectedNotification}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
