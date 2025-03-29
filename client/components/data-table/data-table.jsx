"use client"

import { useState, useEffect } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UpdateStockModal } from "@/app/site/dashboard/inventory/_components/UpdateStockModal"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function DataTable({
  columns,
  data,
  selectedProduct,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  onUpdate,
  searchField = "id",
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    if (isMobile) {
      const newVisibility = {}
      columns.forEach((column) => {
        const key = typeof column.accessorKey === "string" ? column.accessorKey : column.id || ""
        newVisibility[key] = ["id", "customer", "total", "status", "actions"].includes(key)
      })
      setColumnVisibility(newVisibility)
    }
  }, [isMobile, columns])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  if (isMobile) {
    return (
      <div className="space-y-4 bg-blue-50 p-4 rounded-md border">
        <div className="flex items-center py-4">
          <Search className="mr-2 h-4 w-4 text-muted-foreground ml-2" />
          <Input
            placeholder="Search..."
            value={table.getColumn(searchField)?.getFilterValue() ?? ""}
            onChange={(e) => table.getColumn(searchField)?.setFilterValue(e.target.value)}
            className="max-w-sm "
          />
        </div>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.id} className="overflow-hidden">
              <CardContent className="p-4">
                {row.getVisibleCells().map((cell, index) => (
                  <div key={cell.id} className="py-2 flex justify-between border-b last:border-0">
                    <div className="font-medium text-sm text-gray-500">{cell.column.columnDef.header}</div>
                    <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">No results found.</div>
        )}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
          <div className="flex space-x-2">
            <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="text-md bg-sky-400 text-black">Previous</Button>
            <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="text-md bg-sky-400 text-black">Next</Button>
          </div>
        </div>
        {selectedProduct && <UpdateStockModal product={selectedProduct} isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onUpdate={onUpdate} />}
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-blue-50">
      <div className="flex items-center py-4">
        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." value={table.getColumn(searchField)?.getFilterValue() ?? ""} onChange={(e) => table.getColumn(searchField)?.setFilterValue(e.target.value)} className="max-w-sm" />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 p-4">
        <div className="text-sm text-muted-foreground">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="text-md bg-sky-400 text-black">Previous</Button>
          <Button size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="text-md bg-sky-400 text-black">Next</Button>
        </div>
      </div>
      {selectedProduct && <UpdateStockModal product={selectedProduct} isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onUpdate={onUpdate} />}
    </div>
  )
}
