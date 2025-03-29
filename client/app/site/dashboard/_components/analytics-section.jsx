"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chart } from "@/components/ui/DashboardChart"

// Mock data
const profitLoss = [
  { month: "Jan", profit: 12000, loss: 8000 },
  { month: "Feb", profit: 15000, loss: 7500 },
  { month: "Mar", profit: 18000, loss: 9000 },
]

const supplierPerformance = [
  { supplier: "Supplier A", onTime: 45, late: 5 },
  { supplier: "Supplier B", onTime: 38, late: 12 },
  { supplier: "Supplier C", onTime: 42, late: 8 },
]

export function AnalyticsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss</CardTitle>
          <CardDescription>Monthly profit and loss trends</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <Chart>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={profitLoss}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="loss" stroke="hsl(var(--chart-3))" />
              </LineChart>
            </ResponsiveContainer>
          </Chart>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance</CardTitle>
          <CardDescription>On-time vs. late deliveries by supplier</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <Chart>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="supplier" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" name="On-time Deliveries" fill="hsl(var(--chart-1))" />
                <Bar dataKey="late" name="Late Deliveries" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </Chart>
        </CardContent>
      </Card>
    </div>
  )
}

