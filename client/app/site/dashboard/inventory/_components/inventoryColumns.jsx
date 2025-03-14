"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const inventoryColumns = (setSelectedProduct, setIsUpdateModalOpen) => [
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "sku",
    header: "SKU",
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "reorderLevel",
    header: "Reorder-Level",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status == "In Stock") {
        return (
          <div className="rounded-lg bg-green-500 text-center p-2">
            {status}
          </div>
        );
      } else {
        return (
          <div className="rounded-lg bg-red-400 text-center p-2">{status}</div>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product?.sku)}
            >
              Copy product SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                setSelectedProduct(product);
                setIsUpdateModalOpen(true);
              }}
            >
              Update Inventory stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
