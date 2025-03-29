"use client"

import { z } from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormControl, FormDescription, FormMessage, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { CirclePlus, Loader2, Plus, Trash2 } from "lucide-react"
import { createProduct } from "@/actions/serverActions"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productSellingPrice: z.number(),
  productCostPrice: z.number(),
  productDescription: z.string().min(10, {
    message: "Product description must be at least 10 characters",
  }),
  supplier: z.string().min(2, {
    message: "Supplier name must be at least 2 characters",
  }),
  supplierNumber: z.string().min(10, {
    message: "Suppier phone number must be at least 10 characters",
  }),
  reorderLevel: z.number().min(2, {
    message: "Reorder level must not be less than 2",
  }),
  category: z.string().min(2, {
    message: "Category name must not be less than 2 characters",
  }),
  stockKeepingUnit: z.string().min(2, {
    message: "Stock keeping unit must be at least 2 characters",
  }),
  locationStock: z
    .array(
      z.object({
        locationId: z.string().min(1, "Location is required"),
        quantity: z.number().min(0, "Quantity cannot be negative"),
      }),
    )
    .min(1, "At least one location must have stock"),
})

// Sample locations - replace with actual data from your database
const locations = [
  { id: "loc1", name: "Main Warehouse" },
  { id: "loc2", name: "Store Front" },
  { id: "loc3", name: "Distribution Center" },
  { id: "loc4", name: "Secondary Warehouse" },
]

const generateSKU = (name, category) => {
  if (!name || !category) return ""
  const namePart = name.slice(0, 3).toUpperCase() // First 3 letters of product name
  const categoryPart = category.slice(0, 3).toUpperCase() // First 3 letters of category
  const randomNum = Math.floor(1000 + Math.random() * 9000) // Random 4-digit number
  return `${categoryPart}-${namePart}-${randomNum}`
}

const CreateProducts = () => {
  const [manualSKU, setManualSKU] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productSellingPrice: 100,
      productCostPrice: 50,
      productDescription: "",
      supplier: "",
      supplierNumber: "",
      reorderLevel: 10,
      category: "",
      stockKeepingUnit: "",
      locationStock: [{ locationId: "loc1", quantity: 10 }],
    },
  })

  const productName = form.watch("productName")
  const category = form.watch("category")

  useEffect(() => {
    if (!manualSKU) {
      form.setValue("stockKeepingUnit", generateSKU(productName, category))
    }
  }, [productName, category, manualSKU])

  async function onSubmit(values) {
    try {
      setIsLoading(true)

      // Calculate total stock across all locations
      const totalStock = values.locationStock.reduce((sum, item) => sum + item.quantity, 0)

      // Add totalStock to the values for backward compatibility
      const productData = {
        ...values,
        stockQuantity: totalStock,
      }

      const res = await createProduct(productData)
      console.log("This is the response received from the database: ", res)
      form.reset()
      setOpen(false)

      toast({
        title: "SUCCESS!",
        description: "Your product has been created successfully",
      })
    } catch (error) {
      console.log("Error:", error.message)
      toast({
        title: "Error",
        description: "Failed to create product: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-md">
          Create Products <CirclePlus className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Put in the details of your product below</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Product name form field */}
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is the name of the product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Selling Price Form Field */}
            <FormField
              control={form.control}
              name="productSellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Selling Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>This is the price of the product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Product Cost Price Form Field */}
            <FormField
              control={form.control}
              name="productCostPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Cost Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>This is the cost price of the product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Description Form Field */}
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Describe the product Here for easier search</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supplier Form Field */}
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is the name of your supplier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Supplier Number form field */}
            <FormField
              control={form.control}
              name="supplierNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Number</FormLabel>
                  <FormControl>
                    <Input placeholder="09156481044" {...field} />
                  </FormControl>
                  <FormDescription>This is the phone number of the supplier</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reorder level form field */}
            <FormField
              control={form.control}
              name="reorderLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Level</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>The quantity you want the system to send you an alert on</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category form field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is the category of the product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <Checkbox checked={manualSKU} onCheckedChange={() => setManualSKU(Boolean(!manualSKU))} />
              <Label>Enter SKU Manually</Label>
            </div>

            {/* SKU Form Field */}
            <FormField
              control={form.control}
              name="stockKeepingUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!manualSKU} />
                  </FormControl>
                  <FormDescription>This is the SKU identifier of the product</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Stock Per Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentStock = form.getValues("locationStock") || []
                    form.setValue("locationStock", [...currentStock, { locationId: "", quantity: 0 }])
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Location
                </Button>
              </div>

              <Card>
                <CardContent className="pt-4 space-y-4">
                  {form.watch("locationStock")?.map((_, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FormField
                        control={form.control}
                        name={`locationStock.${index}.locationId`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.map((location) => (
                                  <SelectItem key={location.id} value={location.id}>
                                    {location.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`locationStock.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Qty"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const currentStock = form.getValues("locationStock")
                          if (currentStock.length > 1) {
                            form.setValue(
                              "locationStock",
                              currentStock.filter((_, i) => i !== index),
                            )
                          }
                        }}
                        disabled={form.watch("locationStock").length <= 1}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateProducts

