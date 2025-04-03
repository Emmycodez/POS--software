"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function AdjustStockModal({ product, products, isOpen, onClose, onSave, locations }) {
  const [formData, setFormData] = useState({
    productId: "",
    location: "",
    adjustmentType: "Increase",
    quantity: 1,
    toLocation: "",
    notes: "",
  })

  // Initialize form data when a product is selected
  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.id,
        location: product.stock?.[0]?.location || locations[0] || "",
        adjustmentType: "Increase",
        quantity: 1,
        toLocation: "",
        notes: "",
      })
    } else {
      // Reset form for new adjustment
      setFormData({
        productId: "",
        location: locations[0] || "",
        adjustmentType: "Increase",
        quantity: 1,
        toLocation: "",
        notes: "",
      })
    }
  }, [product, locations, isOpen])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  // Get available locations for transfer destination (excluding source location)
  const availableDestinations = locations.filter((loc) => loc !== formData.location)

  // Get max quantity available for transfers or decreases
  const getMaxQuantity = () => {
    if (formData.adjustmentType !== "Increase" && formData.productId) {
      const selectedProduct = products.find((p) => p.id === formData.productId)
      if (selectedProduct) {
        const locationStock = selectedProduct.stock.find((s) => s.location === formData.location)
        return locationStock ? locationStock.quantity : 0
      }
    }
    return 9999 // No limit for increases
  }

  const maxQuantity = getMaxQuantity()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adjust Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product</Label>
            <Select value={formData.productId} onValueChange={(value) => handleChange("productId", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <RadioGroup
              value={formData.adjustmentType}
              onValueChange={(value) => handleChange("adjustmentType", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Increase" id="increase" />
                <Label htmlFor="increase" className="cursor-pointer">
                  Increase (Receiving stock)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Decrease" id="decrease" />
                <Label htmlFor="decrease" className="cursor-pointer">
                  Decrease (Removing stock)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Transfer" id="transfer" />
                <Label htmlFor="transfer" className="cursor-pointer">
                  Transfer (Between locations)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={formData.location} onValueChange={(value) => handleChange("location", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.adjustmentType === "Transfer" && (
            <div className="space-y-2">
              <Label htmlFor="toLocation">To Location</Label>
              <Select
                value={formData.toLocation}
                onValueChange={(value) => handleChange("toLocation", value)}
                required={formData.adjustmentType === "Transfer"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {availableDestinations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={formData.adjustmentType !== "Increase" ? maxQuantity : undefined}
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", Number.parseInt(e.target.value, 10) || 0)}
              required
            />
            {formData.adjustmentType !== "Increase" && (
              <p className="text-xs text-muted-foreground">Available: {maxQuantity} units</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add any additional information"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.productId ||
                !formData.location ||
                formData.quantity <= 0 ||
                (formData.adjustmentType === "Transfer" && !formData.toLocation) ||
                (formData.adjustmentType !== "Increase" && formData.quantity > maxQuantity)
              }
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

