"use client"

import { format } from "date-fns"
import { Mail, MessageSquare, MoreHorizontal, Eye } from "lucide-react"
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

export const alertsColumns = (markAsRead, viewDetails) => [
  {
    accessorKey: "createdAt",
    header: "Date",
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type")

      return (
        <div className="flex items-center">
          {type.includes("email") ? (
            <>
              <Mail className="mr-2 h-4 w-4 text-blue-500" />
              <span>Email</span>
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
              <span>SMS</span>
            </>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("productName")}</div>
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message")
      return (
        <div className="max-w-[500px] truncate" title={message}>
          {message}
        </div>
      )
    },
  },
  {
    accessorKey: "read",
    header: "Status",
    cell: ({ row }) => {
      const isRead = row.getValue("read")

      return isRead ? (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Read
        </Badge>
      ) : (
        <Badge className="bg-blue-500">New</Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const alert = row.original
      const isRead = alert.read

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
            {!isRead && (
              <DropdownMenuItem onClick={() => markAsRead(alert.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => viewDetails(alert)}>View details</DropdownMenuItem>
            {alert.type === "email" && <DropdownMenuItem>Open in email</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

