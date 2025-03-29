"use client"

import { MoreHorizontal, Eye, Edit, Trash2, Globe, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

export const supplierColumns = ({ onView, onEdit, onDelete }) => [
  {
    accessorKey: "name",
    header: "Supplier Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "contactEmail",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("contactEmail")
      if (!email) return <div className="text-muted-foreground italic">Not provided</div>

      return (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone")
      const countryCode = row.original.countryCode || ""

      return (
        <div className="flex items-center">
          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {countryCode} {phone}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address")
      if (!address) return <div className="text-muted-foreground italic">Not provided</div>

      return <div className="truncate max-w-[200px]">{address}</div>
    },
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website")
      if (!website) return <div className="text-muted-foreground italic">Not provided</div>

      return (
        <div className="flex items-center">
          <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate max-w-[150px]"
          >
            {website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return <div>{format(date, "MMM dd, yyyy")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original

      // Add viewDetails to the row data so it can be accessed in mobile view
      if (typeof onView === "function") {
        supplier.viewDetails = () => onView(supplier)
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
            <DropdownMenuItem onClick={() => onView(supplier)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(supplier)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit supplier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(supplier.id)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete supplier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

