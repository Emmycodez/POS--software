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
import { Badge } from "@/components/ui/badge";

export const inventoryColumns = (setSelectedProduct, setIsUpdateModalOpen) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const product = row.original
      const isLowStock = product.quantity > 0 && product.quantity <= product.reorderLevel
      const isOutOfStock = product.quantity === 0

      return (
        <div className="flex w-full items-center gap-2 break-all max-w-[200px]">
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
