"use client"

import { format } from "date-fns"
import { MoreHorizontal, Eye, Printer, Mail, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export const transactionsColumns = (viewTransactionDetails) => [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => {
      return <div className="font-medium">#{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) => {
      const timestamp = row.getValue("createdAt")
      const formattedDate = format(new Date(timestamp), "MMM dd, yyyy")
      const formattedTime = format(new Date(timestamp), "h:mm a")

      return (
        <div className="flex flex-col">
          <span className="font-medium">{formattedDate}</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "products",
    header: "Items",
    cell: ({ row }) => {
      const products = row.getValue("products")
      const itemCount = products.length
      const firstProduct = products[0]?.product?.name || "Product"

      return (
        <div className="flex flex-col">
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          {itemCount > 1 ? (
            <span className="text-xs text-muted-foreground">{firstProduct} & more</span>
          ) : (
            <span className="text-xs text-muted-foreground">{firstProduct}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod")
      // Capitalize first letter of each word
      const formattedMethod = paymentMethod
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return <div>{formattedMethod}</div>
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalAmount"))
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")

      if (status === "completed") {
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        )
      } else if (status === "failed") {
        return (
          <Badge className="bg-red-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        )
      } else {
        return (
          <Badge className="bg-yellow-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        )
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original
      const isFailed = transaction.status === "failed"

      // Add viewDetails to the row data so it can be accessed in mobile view
      if (typeof viewTransactionDetails === "function") {
        transaction.viewDetails = viewTransactionDetails
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => viewTransactionDetails(transaction)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 h-4 w-4" />
              Print receipt
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Email receipt
            </DropdownMenuItem>
            {transaction.status === "pending" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as completed
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Mark as failed
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

