"use client";

import { useState, useEffect } from "react";
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
import { Search } from "lucide-react";
import { format } from "date-fns";

export function ResponsiveDataTable({ columns, data, searchField = "id" }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Set default column visibility based on screen size
  useEffect(() => {
    if (isMobile) {
      // On mobile, hide less important columns
      const newVisibility = {};
      columns.forEach((column) => {
        const key =
          typeof column.accessorKey === "string"
            ? column.accessorKey
            : column.id || "";
        if (
          key &&
          !["id", "customer", "total", "status", "actions"].includes(key)
        ) {
          newVisibility[key] = false;
        } else {
          newVisibility[key] = true;
        }
      });
      setColumnVisibility(newVisibility);
    }
  }, [isMobile, columns]); // Runs when `isMobile` or `columns` change

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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      table.getColumn(searchField)?.setFilterValue(searchTerm);
      console.log("Searching for:", searchTerm);
    }, 500); // Waits 500ms after the user stops typing

    return () => clearTimeout(timeoutId); // Clears timeout on every keystroke
  }, [searchTerm, table, searchField]);

  // For mobile view, render cards instead of a table
  if (isMobile) {
    return (
      <div>
        <div className="flex items-center py-4">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="space-y-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const item = row.original;
              return (
                <Card
                  key={row.id}
                  className={
                    item.status === "Refunded"
                      ? "border-l-4 border-l-red-500"
                      : item.status === "Completed"
                      ? "border-l-4 border-l-green-500"
                      : ""
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">
                        {item.id ? `#${item.id}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.date
                          ? format(new Date(item.date), "MMM dd, yyyy h:mm a")
                          : ""}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">
                        {item.customer || "Walk-in Customer"}
                      </div>
                      <div className="font-medium">
                        $
                        {typeof item.total === "number"
                          ? item.total.toFixed(2)
                          : item.total}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-muted-foreground">
                        {item.items
                          ? `${item.items} ${
                              item.items === 1 ? "item" : "items"
                            }`
                          : ""}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {item.status}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            // Call the viewDetails function if it exists
                            if (typeof item.viewDetails === "function") {
                              item.viewDetails(item);
                            }
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No results found.
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
        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={table.getColumn(searchField)?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn(searchField)?.setFilterValue(event.target.value)
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
