"use client"

import { format } from "date-fns"
import { Edit, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ProductDetailsModal({ product, isOpen, onClose }) {
  if (!product) return null

  const formattedDate = format(new Date(product.lastUpdated), "MMMM dd, yyyy")
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(product.price)

  const isLowStock = product.quantity > 0 && product.quantity <= product.reorderLevel
  const isOutOfStock = product.quantity === 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {product.name}
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
          </DialogTitle>
          <DialogDescription>
            SKU: {product.sku} • Last updated on {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p className="text-sm">{product.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <p className="text-base font-semibold">{product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
              <p className="text-base font-semibold">{formattedPrice}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Stock</h3>
              <div className="flex items-center">
                <p className="text-base font-semibold">
                  {product.quantity}
                  {(isLowStock || isOutOfStock) && <AlertTriangle className="inline ml-2 h-4 w-4 text-yellow-600" />}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Reorder Level</h3>
              <p className="text-base font-semibold">{product.reorderLevel}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Supplier Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs text-muted-foreground">Name</h4>
                <p className="text-sm font-medium">{product.supplierName}</p>
              </div>
              <div>
                <h4 className="text-xs text-muted-foreground">Contact Number</h4>
                <p className="text-sm font-medium">{product.supplierNumber}</p>
              </div>
            </div>
          </div>

          {isLowStock && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <h3 className="text-sm font-medium text-yellow-800 mb-1 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Low Stock Warning
              </h3>
              <p className="text-sm text-yellow-700">
                This product is below the reorder level. Consider restocking soon.
              </p>
            </div>
          )}

          {isOutOfStock && (
            <div className="bg-red-50 p-3 rounded-md border border-red-200">
              <h3 className="text-sm font-medium text-red-800 mb-1 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Out of Stock
              </h3>
              <p className="text-sm text-red-700">
                This product is currently out of stock. Please reorder as soon as possible.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
