"use client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
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
import { format } from "date-fns"


// Define the product columns with action handlers
export const productColumns = ({ onView, onEdit, businessId, onDelete }) => {
  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium flex w-full max-w-[150px]">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity")
        const reorderLevel = row.original.reorderLevel
        const stockDetails = row.original.stock || []

        // Determine status based on quantity
        let status
        let statusColor
        if (quantity === 0) {
          status = "Out of Stock"
          statusColor = "bg-red-100 text-red-800"
        } else if (quantity <= reorderLevel) {
          status = "Low Stock"
          statusColor = "bg-yellow-100 text-yellow-800"
        } else {
          status = "In Stock"
          statusColor = "bg-green-100 text-green-800"
        }

        return (
          <div className="flex items-center space-x-2">
            <div className="font-medium">{quantity}</div>
            <Badge variant="outline" className={statusColor}>
              {status}
            </Badge>
            {stockDetails.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <span className="sr-only">Show location details</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Stock by Location</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {stockDetails.map((item, index) => (
                    <DropdownMenuItem key={index} className="flex justify-between cursor-default">
                      <span>{item.location}</span>
                      <span className="font-medium">{item.quantity}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "sellingPrice",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("sellingPrice"))
        const formatted = new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: "NGN",
        }).format(amount)

        return <div>{formatted}</div>
      },
    },
    {
      accessorKey: "supplierName",
      header: "Supplier",
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.getValue("lastUpdated")
        if (!date) return "-"
        return format(new Date(date), "MMM d, yyyy")
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

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
              <DropdownMenuItem onClick={() => onView(product)}>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(product.id,businessId )} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return columns
}

