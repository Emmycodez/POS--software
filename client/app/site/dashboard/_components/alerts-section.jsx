"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data
const recentAlerts = [
  { product: "Wireless Earbuds", type: "Low Stock", date: "2023-07-01" },
  { product: "Smart Watch", type: "Out of Stock", date: "2023-07-02" },
  { product: "Organic Milk", type: "Near Expiry", date: "2023-07-01" },
]

const alertSummary = [
  { name: "Low Stock", value: 28 },
  { name: "Out of Stock", value: 12 },
  { name: "Near Expiry", value: 35 },
  { name: "Expired", value: 8 },
]

export function AlertsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Stock Alerts</CardTitle>
          <CardDescription>Unread alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Alert Type</TableHead>
                <TableHead>Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAlerts.map((alert, index) => (
                <TableRow key={index}>
                  <TableCell>{alert.product}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.type === "Low Stock"
                          ? "warning"
                          : alert.type === "Out of Stock"
                            ? "destructive"
                            : alert.type === "Near Expiry"
                              ? "warning"
                              : "destructive"
                      }
                    >
                      {alert.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{alert.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Unread Notifications</CardTitle>
          <CardDescription>Alerts requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">15</div>
            <p className="text-sm text-muted-foreground">Unread alerts</p>
            <div className="mt-4 grid gap-2">
              <div className="flex justify-between text-sm">
                <span>Low Stock</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Out of Stock</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Near Expiry</span>
                <span className="font-medium">4</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

