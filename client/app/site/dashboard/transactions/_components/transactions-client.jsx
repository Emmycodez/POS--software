"use client"

import { useState } from "react"
import { ResponsiveDataTable } from "@/components/responsive-data-table" 
import { transactionsColumns } from "./columns" 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { TransactionDetailsModal } from "./transaction-details-modal" 
import { Button } from "@/components/ui/button"
import { Download, CreditCard, Banknote, Receipt, TrendingUp, Smartphone, Building } from "lucide-react"
import { format, subDays } from "date-fns"
import { exportToCSV } from "@/lib/export-utils"

export default function TransactionsClient({transactionsData}) {
  const [data, setData] = useState(transactionsData)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [activeTab, setActiveTab] = useState("all")

  // Calculate summary statistics
  const rawTotalSales = data?.reduce((sum, transaction) => sum + transaction.totalAmount, 0)
  const totalSales = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(rawTotalSales);
  const totalTransactions = data?.length
  const averageTransaction = totalSales / totalTransactions
  const cashTransactions = data?.filter((t) => t.paymentMethod === "cash").length
  const cardTransactions = data?.filter((t) => t.paymentMethod === "card").length
  const mobileMoneyTransactions = data?.filter((t) => t.paymentMethod === "mobile money").length
  const bankTransferTransactions = data?.filter((t) => t.paymentMethod === "transfer").length

  // Function to view transaction details
  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  // Function to filter transactions by date range
  const filterByDateRange = (from, to) => {
    setDateRange({ from, to })
    // In a real app, you would fetch data from your API with the date range
    // For now, we'll just simulate filtering the existing data
    const filtered = transactionsData.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt)
      return transactionDate >= from && transactionDate <= to
    })
    setData(filtered)
  }

  // Function to handle export
  const handleExport = () => {
    // Get the current filtered data based on active tab
    let dataToExport = [...data]
    if (activeTab === "completed") {
      dataToExport = data.filter((transaction) => transaction.status === "completed")
    } else if (activeTab === "pending") {
      dataToExport = data.filter((transaction) => transaction.status === "pending")
    } else if (activeTab === "failed") {
      dataToExport = data.filter((transaction) => transaction.status === "failed")
    }

    // Format data for export
    const formattedData = dataToExport.map((transaction) => {
      // Format date
      const date = new Date(transaction.createdAt)
      const formattedDate = format(date, "yyyy-MM-dd")
      const formattedTime = format(date, "HH:mm:ss")

      // Format payment method
      const paymentMethod = transaction.paymentMethod
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Format products
      const productsList = transaction.products.map((p) => `${p.quantity}x ${p.product.name}`).join(", ")

      // Return formatted row
      return {
        "Transaction ID": transaction.id,
        Date: formattedDate,
        Time: formattedTime,
        Products: productsList,
        "Payment Method": paymentMethod,
        "Total Amount": transaction.totalAmount.toFixed(2),
        "Amount Received": transaction.amountReceived.toFixed(2),
        "Change Given": transaction.changeGiven.toFixed(2),
        Status: transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1),
      }
    })

    // Generate filename with date range
    const fromDate = format(dateRange.from, "yyyy-MM-dd")
    const toDate = format(dateRange.to, "yyyy-MM-dd")
    const filename = `transactions_${fromDate}_to_${toDate}.csv`

    // Export to CSV
    exportToCSV(formattedData, filename)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage all transactions from your POS system</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <DatePickerWithRange
            date={dateRange}
            onUpdate={(range) => {
              if (range.from && range.to) {
                filterByDateRange(range.from, range.to)
              }
            }}
          />
          <Button variant="outline" className="ml-0 sm:ml-2" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Sales</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalSales}</div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transactions</CardTitle>
            <CardDescription>Total count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Card Payments</CardTitle>
            <CardDescription>Total transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{cardTransactions}</div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cash Payments</CardTitle>
            <CardDescription>Total transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{cashTransactions}</div>
              <Banknote className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mobile Money</CardTitle>
            <CardDescription>Total transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mobileMoneyTransactions}</div>
              <Smartphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Bank Transfers</CardTitle>
            <CardDescription>Total transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{bankTransferTransactions}</div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ResponsiveDataTable columns={transactionsColumns(viewTransactionDetails)} data={data} searchField="id" />
        </TabsContent>
        <TabsContent value="completed">
          <ResponsiveDataTable
            columns={transactionsColumns(viewTransactionDetails)}
            data={data.filter((transaction) => transaction.status === "completed")}
            searchField="id"
          />
        </TabsContent>
        <TabsContent value="pending">
          <ResponsiveDataTable
            columns={transactionsColumns(viewTransactionDetails)}
            data={data.filter((transaction) => transaction.status === "pending")}
            searchField="id"
          />
        </TabsContent>
        <TabsContent value="failed">
          <ResponsiveDataTable
            columns={transactionsColumns(viewTransactionDetails)}
            data={data.filter((transaction) => transaction.status === "failed")}
            searchField="id"
          />
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </div>
  )
}

