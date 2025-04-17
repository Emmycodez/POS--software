"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { CirclePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { createProduct, createSupplier } from "@/actions/NextServerActions";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

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
  reorderLevel: z.number().min(2, {
    message: "Reorder level must not be less than 2",
  }),
  category: z.string().min(2, {
    message: "Category name must not be less than 2 characters",
  }),
  stockKeepingUnit: z.string().min(2, {
    message: "Stock keeping unit must be at least 2 characters",
  }),
  batchNumber: z.string().optional(),
  batchExpiry: z.date().optional(),
  locationStock: z
    .array(
      z.object({
        locationId: z.string().min(1, "Location is required"),
        quantity: z.number().min(0, "Quantity cannot be negative"),
      })
    )
    .min(1, "At least one location must have stock"),
});

// Sample locations - replace with actual data from your database

const generateBatchNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900); // 3-digit random number
  return `B${year}${month}${day}-${random}`;
};

const generateSKU = async (name, category, businessId) => {
  if (!name || !category || !businessId) throw new Error("Missing required fields");

  const namePart = name.slice(0, 3).toUpperCase().replace(/\s+/g, ''); // Remove spaces
  const categoryPart = category.slice(0, 3).toUpperCase().replace(/\s+/g, ''); 
  const businessPart = businessId.toString().slice(-4).toUpperCase(); // Last 4 chars of business ID

  let sku;
  let attempts = 0;
  
  do {
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit (100-999)
    sku = `${categoryPart}-${namePart}-${businessPart}-${randomNum}`;
    attempts++;
    
    // Safety net to prevent infinite loops
    if (attempts > 5) throw new Error("Failed to generate unique SKU");
    
    // Check if SKU exists in THIS business
    const exists = await Product.exists({ sku, business: businessId });
  } while (exists);

  return sku;
};

// Update the CreateProducts component definition to include default values for props
const CreateProducts = ({ locations, suppliers, currentBusiness, selectedLocation }) => {
  const [manualSKU, setManualSKU] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [isCreatingSupplier, setIsCreatingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contactEmail: "",
    phone: "",
    countryCode: "",
    address: "",
    website: "",
  });
  const [manualBatch, setManualBatch] = useState(false);
  

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productSellingPrice: 100,
      productCostPrice: 50,
      productDescription: "",
      supplier: "",
      batchNumber: generateBatchNumber(),
      batchExpiry: null,
      reorderLevel: 10,
      category: "",
      stockKeepingUnit: "",
      locationStock: [{ locationId: "loc1", quantity: 10 }],
    },
  });

  const productName = form.watch("productName");
  const category = form.watch("category");

  useEffect(() => {
    if (!manualSKU) {
      form.setValue("stockKeepingUnit", generateSKU(productName, category));
    }
  }, [productName, category, manualSKU]);

  useEffect(() => {
    if (!manualBatch) {
      form.setValue("batchNumber", generateBatchNumber());
    }
  }, [manualBatch]);

  async function onSubmit(values) {
    try {
      setIsLoading(true);

      // Calculate total stock across all locations
      const totalStock = values.locationStock.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      // Add totalStock to the values for backward compatibility
      const productData = {
        ...values,
        stockQuantity: totalStock,
      };

      const res = await createProduct(productData, currentBusiness, );
      console.log("This is the response received from the database: ", res);
      form.reset();
      setOpen(false);

      if (res.success) {
        toast({
          title: "SUCCESS!",
          description: "Your product has been created successfully",
        });
      } else if (!res.success) {
        toast({
          title: "Error",
          description: "Failed to create product: " + error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Error:", error.message);
      toast({
        title: "Error",
        description: "Failed to create product: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateSupplier = async () => {
    if (newSupplier.name.length < 2) {
      toast({
        title: "Error",
        description: "Supplier name must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await createSupplier(newSupplier, currentBusiness);

      if (res.success) {
        // Reset the new supplier form
        setNewSupplier({
          name: "",
          contactEmail: "",
          phone: "",
          countryCode: "",
          address: "",
          website: "",
        });

        toast({
          title: "Success",
          description: "New supplier created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create supplier: " + error.message,
        variant: "destructive",
      });
    }
  };

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
          <DialogDescription>
            Put in the details of your product below
          </DialogDescription>
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
                  <FormDescription>
                    This is the name of the product
                  </FormDescription>
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the price of the product
                  </FormDescription>
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the cost price of the product
                  </FormDescription>
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
                  <FormDescription>
                    Describe the product Here for easier search
                  </FormDescription>
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
                    {isCreatingSupplier ? (
                      <Card className="border p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Create New Supplier</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCreatingSupplier(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="supplier-name">
                              Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="supplier-name"
                              placeholder="Supplier name"
                              value={newSupplier.name}
                              onChange={(e) =>
                                setNewSupplier({
                                  ...newSupplier,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="supplier-email">Email</Label>
                            <Input
                              id="supplier-email"
                              type="email"
                              placeholder="contact@supplier.com"
                              value={newSupplier.contactEmail}
                              onChange={(e) =>
                                setNewSupplier({
                                  ...newSupplier,
                                  contactEmail: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor="supplier-country-code">
                                Country Code
                              </Label>
                              <Input
                                id="supplier-country-code"
                                placeholder="+1"
                                value={newSupplier.countryCode}
                                onChange={(e) =>
                                  setNewSupplier({
                                    ...newSupplier,
                                    countryCode: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="supplier-phone">
                                Phone Number
                              </Label>
                              <Input
                                id="supplier-phone"
                                placeholder="1234567890"
                                value={newSupplier.phone}
                                onChange={(e) =>
                                  setNewSupplier({
                                    ...newSupplier,
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="supplier-address">Address</Label>
                            <Input
                              id="supplier-address"
                              placeholder="123 Business St, City, Country"
                              value={newSupplier.address}
                              onChange={(e) =>
                                setNewSupplier({
                                  ...newSupplier,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="supplier-website">Website</Label>
                            <Input
                              id="supplier-website"
                              placeholder="https://supplier.com"
                              value={newSupplier.website}
                              onChange={(e) =>
                                setNewSupplier({
                                  ...newSupplier,
                                  website: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setIsCreatingSupplier(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              variant="default"
                              size="sm"
                              onClick={handleCreateSupplier}
                            >
                              Save Supplier
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="flex gap-2">
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem
                                key={supplier.id}
                                value={supplier.id}
                              >
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setIsCreatingSupplier(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </FormControl>
                  <FormDescription>
                    Select an existing supplier or create a new one
                  </FormDescription>
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    The quantity you want the system to send you an alert on
                  </FormDescription>
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
                  <FormDescription>
                    This is the category of the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={manualBatch}
                  onCheckedChange={() => setManualBatch(Boolean(!manualBatch))}
                />
                <Label>Enter Batch Number Manually</Label>
              </div>

              {/* Batch Number Field */}
              <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!manualBatch}
                        placeholder="Batch-001"
                      />
                    </FormControl>
                    <FormDescription>
                      This is the info on the product batch
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      When this batch of products will expire
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={manualSKU}
                onCheckedChange={() => setManualSKU(Boolean(!manualSKU))}
              />
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
                  <FormDescription>
                    This is the SKU identifier of the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Stock Per Location
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentStock = form.getValues("locationStock") || [];
                    form.setValue("locationStock", [
                      ...currentStock,
                      { locationId: "", quantity: 0 },
                    ]);
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.map((location) => (
                                  <SelectItem
                                    key={location.id}
                                    value={location.id}
                                  >
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
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : Number(e.target.value)
                                  )
                                }
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
                          const currentStock = form.getValues("locationStock");
                          if (currentStock.length > 1) {
                            form.setValue(
                              "locationStock",
                              currentStock.filter((_, i) => i !== index)
                            );
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
  );
};

export default CreateProducts;
