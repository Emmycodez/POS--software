"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ResponsiveDataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Set default column visibility based on screen size
  useState(() => {
    if (isMobile) {
      // On mobile, hide less important columns
      setColumnVisibility({
        message: false,
        createdAt: true,
        type: true,
        productName: true,
        read: true,
        actions: true,
      });
    }
  }, [isMobile]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // For mobile view, render cards instead of a table
  if (isMobile) {
    return (
      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter notifications..."
            value={table.getColumn("productName")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("productName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>

        <div className="space-y-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const alert = row.original;
              const date = new Date(alert.createdAt);
              const formattedDate = date.toLocaleDateString();

              return (
                <Card
                  key={row.id}
                  className={!alert.read ? "border-l-4 border-l-blue-500" : ""}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{alert.productName}</div>
                      <div className="text-xs text-muted-foreground">
                        {formattedDate}
                      </div>
                    </div>
                    <div className="text-sm mb-2">{alert.message}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        {alert.type.includes("email")? (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Email
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            SMS
                          </span>
                        )}
                      </div>
                      {!alert.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Get the markAsRead function from the original component
                            const markAsRead =
                              columns[5].cell.props.row.original.markAsRead;
                            if (markAsRead) markAsRead(alert.id);
                          }}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No notifications found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For desktop view, render the table
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter notifications..."
          value={table.getColumn("productName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("productName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    !row.original.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
