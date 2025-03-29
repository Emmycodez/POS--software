"use client"

import { MoreHorizontal, Eye, Edit, Trash2, AlertTriangle } from "lucide-react"
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

export const productColumns = ({ onView, onEdit, onDelete }) => [
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      const product = row.original
      const isLowStock = product.quantity > 0 && product.quantity <= product.reorderLevel
      const isOutOfStock = product.quantity === 0

      return (
        <div className="flex w-full items-center gap-2 break-all max-w-[300px]">
          <span className="font-medium">{product.name}</span>
          {isLowStock && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Low Stock
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outline" className="bg-red-100 text-red-800">
              Out of Stock
            </Badge>
          )}
        </div>
      )
    },
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
    header: "Quantity",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity")
      const reorderLevel = row.original.reorderLevel

      if (quantity === 0) {
        return (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="mr-1 h-4 w-4" />
            <span>{quantity}</span>
          </div>
        )
      } else if (quantity <= reorderLevel) {
        return (
          <div className="flex items-center text-yellow-600">
            <AlertTriangle className="mr-1 h-4 w-4" />
            <span>{quantity}</span>
          </div>
        )
      }

      return <div>{quantity}</div>
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price")
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(price)

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
      const lastUpdated = row.getValue("lastUpdated");
    
      // Ensure lastUpdated is a valid date
      const date = lastUpdated ? new Date(lastUpdated) : null;
    
      if (!date || isNaN(date.getTime())) {
        return <div>—</div>; // Display a fallback value if the date is invalid
      }
    
      return <div>{format(date, "MMM dd, yyyy")}</div>;
    },
    
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      // Add viewDetails to the row data so it can be accessed in mobile view
      if (typeof onView === "function") {
        product.viewDetails = () => onView(product)
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
            <DropdownMenuItem onClick={() => onView(product)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

