"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Chart } from "@/components/ui/DashboardChart"

// Mock data
const stockTurnover = [
  { category: "Electronics", sold: 400, replenished: 300 },
  { category: "Clothing", sold: 300, replenished: 250 },
  { category: "Food", sold: 200, replenished: 220 },
  { category: "Home", sold: 278, replenished: 300 },
]

const expiryData = [
  { name: "30 Days", value: 25 },
  { name: "60 Days", value: 35 },
  { name: "90 Days", value: 40 },
]

const outOfStockProducts = [
  { name: "Wireless Earbuds", sku: "WE-001", lastRestock: "2023-05-15" },
  { name: "Smart Watch", sku: "SW-002", lastRestock: "2023-06-01" },
]

export  function InventorySection() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,568.00</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low-Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">-3 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out-of-Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Turnover Rate</CardTitle>
            <CardDescription>Stock sold vs. replenished by category</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Chart>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stockTurnover}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="hsl(var(--chart-1))" name="Sold" />
                  <Bar dataKey="replenished" fill="hsl(var(--chart-2))" name="Replenished" />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Near-Expiry Products</CardTitle>
            <CardDescription>Products expiring in the next 30/60/90 days</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Chart>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expiryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expiryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Out-of-Stock Products</CardTitle>
          <CardDescription>Products that need urgent reordering</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Last Restock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outOfStockProducts.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.lastRestock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

