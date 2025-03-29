"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
const salesData = [
  { name: "Jan", revenue: 4000, profit: 2400, expenses: 1600 },
  { name: "Feb", revenue: 3000, profit: 1398, expenses: 1602 },
  { name: "Mar", revenue: 9800, profit: 5800, expenses: 4000 },
  { name: "Apr", revenue: 3908, profit: 2000, expenses: 1908 },
  { name: "May", revenue: 4800, profit: 2800, expenses: 2000 },
  { name: "Jun", revenue: 3800, profit: 2300, expenses: 1500 },
]

const topProducts = [
  { name: "Product A", sales: 4000 },
  { name: "Product B", sales: 3000 },
  { name: "Product C", sales: 2000 },
  { name: "Product D", sales: 2780 },
  { name: "Product E", sales: 1890 },
]

const worstProducts = [
  { name: "Product V", sales: 300 },
  { name: "Product W", sales: 250 },
  { name: "Product X", sales: 200 },
  { name: "Product Y", sales: 150 },
  { name: "Product Z", sales: 100 },
]

export function SalesFinancialSection() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">View Details</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21,456.78</div>
            <p className="text-xs text-muted-foreground">View Details</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">300</div>
            <p className="text-xs text-muted-foreground">View Details</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47.4%</div>
            <p className="text-xs text-muted-foreground">View Details</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly revenue, profit, and expenses</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Chart>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" />
                  <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-3))" />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Transaction Value</CardTitle>
            <CardDescription>Daily average transaction value</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Chart>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={[
                    { day: "Mon", value: 34 },
                    { day: "Tue", value: 42 },
                    { day: "Wed", value: 55 },
                    { day: "Thu", value: 48 },
                    { day: "Fri", value: 72 },
                    { day: "Sat", value: 80 },
                    { day: "Sun", value: 74 },
                  ]}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top-Selling Products</CardTitle>
            <CardDescription>Products with highest sales volume</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Chart>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--chart-1))">
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Least-Selling Products</CardTitle>
            <CardDescription>Products with lowest sales volume</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Chart>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={worstProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--chart-3))">
                    {worstProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

