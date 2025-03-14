"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"



export function UpdateStockModal({ product, isOpen, onClose, onUpdate }) {
  const [newQuantity, setNewQuantity] = useState(product ? product.quantity.toString() : "0")
  const [isLoading, setIsLoading] = useState(false)

  // Update the newQuantity state when the product changes
  useState(() => {
    if (product) {
      setNewQuantity(product.quantity.toString())
    }
  })

  const handleSubmit = async (e) => {
    console.log("Calling the handle submit function of the update stock")
    e.preventDefault()

    if (!product) return

    if (isNaN(Number(newQuantity)) || Number(newQuantity) < 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    setIsLoading(true)

    try {
      // Call the onUpdate function passed from the parent
      onUpdate(product.id, Number(newQuantity))
      toast.success(`Stock updated for ${product.name}`)
    } catch (error) {
      toast.error("Failed to update stock")
      console.error(error)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Stock Quantity</DialogTitle>
          <DialogDescription>
            Update the stock quantity for {product.name} (SKU: {product.sku})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-stock" className="text-right">
                Current Stock
              </Label>
              <Input id="current-stock" value={product.quantity} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-stock" className="text-right">
                New Stock
              </Label>
              <Input
                id="new-stock"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="col-span-3"
                type="number"
                min="0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

