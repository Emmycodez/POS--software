"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const categories = [
  "Electronics",
  "Furniture",
  "Office Supplies",
  "Stationery",
  "Computer Accessories",
  "Networking",
  "Storage",
  "Peripherals",
]

export function AddEditProductModal({ product, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    sku: "",
    description: "",
    category: "",
    quantity: 0,
    reorderLevel: 0,
    price: 0,
    supplierName: "",
    supplierNumber: "",
    lastUpdated: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        quantity: Number(product.quantity),
        reorderLevel: Number(product.reorderLevel),
        price: Number(product.price),
      })
    } else {
      setFormData({
        id: "",
        name: "",
        sku: "",
        description: "",
        category: "",
        quantity: 0,
        reorderLevel: 0,
        price: 0,
        supplierName: "",
        supplierNumber: "",
        lastUpdated: new Date().toISOString(),
      })
    }
    setErrors({})
  }, [product, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "reorderLevel" || name === "price" ? Number(value) : value,
    })
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.sku.trim()) newErrors.sku = "SKU is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (formData.quantity < 0) newErrors.quantity = "Quantity cannot be negative"
    if (formData.reorderLevel < 0) newErrors.reorderLevel = "Reorder level cannot be negative"
    if (formData.price <= 0) newErrors.price = "Price must be greater than zero"
    if (!formData.supplierName.trim()) newErrors.supplierName = "Supplier name is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }
    setIsLoading(true)
    try {
      const updatedProduct = { ...formData, lastUpdated: new Date().toISOString() }
      onSave(updatedProduct)
      toast.success(`Product ${product ? "updated" : "added"} successfully`)
    } catch (error) {
      toast.error(`Failed to ${product ? "update" : "add"} product`)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product ? "Update the details for this product" : "Fill in the details to add a new product to your inventory"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} className={errors.name ? "border-red-500" : ""} />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} className={errors.sku ? "border-red-500" : ""} />
                {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-sky-400 text-black hover:bg-sky-500">
              {isLoading ? "Saving..." : product ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
