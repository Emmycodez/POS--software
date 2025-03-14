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
import { CirclePlus, Loader2 } from "lucide-react";
import { createProduct } from "@/actions/serverActions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productPrice: z.number(),
  stockQuantity: z.number(),
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
});

const generateSKU = (name, category) => {
  if (!name || !category) return "";
  const namePart = name.slice(0, 3).toUpperCase(); // First 3 letters of product name
  const categoryPart = category.slice(0, 3).toUpperCase(); // First 3 letters of category
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `${categoryPart}-${namePart}-${randomNum}`;
};

const CreateProducts = () => {
  const [manualSKU, setManualSKU] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productPrice: 100,
      stockQuantity: 10,
      productDescription: "",
      supplier: "",
      supplierNumber: "",
      reorderLevel: 10,
      category: "",
      stockKeepingUnit: "",
    },
  });

  const productName = form.watch("productName");
  const category = form.watch("category");

  useEffect(() => {
    if (!manualSKU) {
      form.setValue("stockKeepingUnit", generateSKU(productName, category));
    }
  }, [productName, category, manualSKU]);

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      const res = await createProduct(values);
      console.log("This is the response received from the databse: ", res);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setIsLoading(false);
      toast({
        title: "SUCCESS!",
        description: "Your product has been created successfully",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-md">
          Create Products <CirclePlus className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
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

            {/* Product Price Form Field */}
            <FormField
              control={form.control}
              name="productPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
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

            {/* Stock Quantity Form Field */}
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
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
                    This is the number of the product you have in stock
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of your supplier
                  </FormDescription>
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
                  <FormDescription>
                    This is the phone number of the supplier
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
// const handleSubmit = (e) => {
//   e.preventDefault();
//   console.log({
//     productName: productName.trim(),
//     productPrice,
//     stockQuantity,
//     productDescription: productDescription.trim(),
//     supplier: supplier.trim(),
//     reorderLevel,
//     category: category.trim(),
//     stockKeepingUnit: stockKeepingUnit.trim(),
//   });
// };

// const [productName, setProductName] = useState("");
// const [productPrice, setProductPrice] = useState(0);
// const [stockQuantity, setStockQuantity] = useState(0);
// const [productDescription, setProductDescription] = useState("");
// const [supplier, setSupplier] = useState("");
// const [reorderLevel, setReorderLevel] = useState(2);
// const [category, setCategory] = useState("");
// const [stockKeepingUnit, setStockKeepingUnit] = useState("");

{
  /* <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productName" className="text-right">
              Name
            </Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productPrice" className="text-right">
              Price
            </Label>
            <Input
              id="productPrice"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Product Price"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stockKeepingUnit" className="text-right">
              SKU
            </Label>
            <Input
              id="stockKeepingUnit"
              value={stockKeepingUnit}
              onChange={(e) => setStockKeepingUnit(e.target.value)}
              placeholder="Stock Keeping Unit"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stockQuantity" className="text-right">
              Stock Quantity
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="Stock Quantity"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Type your product description"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Input
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Product Supplier"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reorderLevel" className="text-right">
              Reorder Level
            </Label>
            <Input
              id="reorderLevel"
              type="number"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
              placeholder="Product Reorder Level"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Product Category"
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form> */
}
