"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDataTable } from "@/components/responsive-data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AdjustStockModal } from "./adjust-stock-modal";
import { exportToCSV } from "@/lib/export-utils";
import { format } from "date-fns";
import { useLocationStore } from "@/providers/location-store-provider";
import { getInventoryByLocation } from "@/actions/inventoryActions";

// Sample data that matches your backend structure - same as products
// const sampleProducts = {
//   data: [
//     {
//       id: "1",
//       name: "Glimmer Lamp",
//       sku: "GL-001",
//       description: "A beautiful decorative lamp with ambient lighting",
//       reorderLevel: 10,
//       supplierName: "Luminance Creations",
//       category: "Home Decor",
//       supplierNumber: "+1 555-123-4567",
//       price: 12000,
//       lastUpdated: "2023-03-15T10:30:00Z",
//       stock: [
//         { location: "Main Warehouse", quantity: 25 },
//         { location: "Store Front", quantity: 5 },
//       ],
//     },
//     {
//       id: "2",
//       name: "Aqua Filter",
//       sku: "AF-002",
//       description: "High-quality water filter for home use",
//       reorderLevel: 15,
//       supplierName: "HydraClean Solutions",
//       category: "Kitchen Appliances",
//       supplierNumber: "+1 555-987-6543",
//       price: 8500,
//       lastUpdated: "2023-03-10T14:45:00Z",
//       stock: [
//         { location: "Main Warehouse", quantity: 30 },
//         { location: "Store Front", quantity: 8 },
//       ],
//     },
//     {
//       id: "3",
//       name: "Eco Planter",
//       sku: "EP-003",
//       description: "Sustainable plant pot made from recycled materials",
//       reorderLevel: 20,
//       supplierName: "GreenGrowth Designers",
//       category: "Garden",
//       supplierNumber: "+1 555-456-7890",
//       price: 3500,
//       lastUpdated: "2023-03-05T09:15:00Z",
//       stock: [
//         { location: "Main Warehouse", quantity: 5 },
//         { location: "Store Front", quantity: 2 },
//       ],
//     },
//     {
//       id: "4",
//       name: "Zest Juicer",
//       sku: "ZJ-004",
//       description: "Powerful juicer for fruits and vegetables",
//       reorderLevel: 8,
//       supplierName: "FreshTech Appliances",
//       category: "Kitchen Appliances",
//       supplierNumber: "+1 555-789-0123",
//       price: 15000,
//       lastUpdated: "2023-03-01T11:20:00Z",
//       stock: [
//         { location: "Main Warehouse", quantity: 12 },
//         { location: "Store Front", quantity: 3 },
//       ],
//     },
//     {
//       id: "5",
//       name: "Flexi Wearable",
//       sku: "FW-005",
//       description: "Fitness tracker with heart rate monitoring",
//       reorderLevel: 10,
//       supplierName: "Vitality Gear Co.",
//       category: "Electronics",
//       supplierNumber: "+1 555-234-5678",
//       price: 22000,
//       lastUpdated: "2023-02-25T16:30:00Z",
//       stock: [
//         { location: "Main Warehouse", quantity: 0 },
//         { location: "Store Front", quantity: 0 },
//       ],
//     },
//   ],
// }

// Sample inventory movements
const sampleMovements = [
  {
    id: "1",
    productId: "1",
    productName: "Glimmer Lamp",
    sku: "GL-001",
    type: "Received",
    quantity: 10,
    location: "Main Warehouse",
    date: "2023-03-10T09:30:00Z",
    notes: "Received from supplier",
  },
  {
    id: "2",
    productId: "1",
    productName: "Glimmer Lamp",
    sku: "GL-001",
    type: "Transfer",
    quantity: 5,
    location: "Main Warehouse",
    toLocation: "Store Front",
    date: "2023-03-12T14:15:00Z",
    notes: "Transferred to store",
  },
  {
    id: "3",
    productId: "2",
    productName: "Aqua Filter",
    sku: "AF-002",
    type: "Sold",
    quantity: 2,
    location: "Store Front",
    date: "2023-03-14T16:45:00Z",
    notes: "Sold to customer",
  },
  {
    id: "4",
    productId: "3",
    productName: "Eco Planter",
    sku: "EP-003",
    type: "Adjustment",
    quantity: -1,
    location: "Main Warehouse",
    date: "2023-03-15T11:20:00Z",
    notes: "Damaged item",
  },
  {
    id: "5",
    productId: "4",
    productName: "Zest Juicer",
    sku: "ZJ-004",
    type: "Received",
    quantity: 5,
    location: "Main Warehouse",
    date: "2023-03-16T10:00:00Z",
    notes: "Restocking",
  },
];

export default function InventoryPage({ session }) {
  const businessId = session?.user?.currentBusiness;
  const locationId = useLocationStore((state) => state.selectedLocation);
  const [sampleProducts, setSampleProducts] = useState(null);

  useEffect(() => {
    const handleFunction = async () => {
      const data = await getInventoryByLocation(businessId, locationId);
      setSampleProducts(data);
      console.log(sampleProducts)
    };
    handleFunction();
  }, [locationId, businessId]);

  const transformedProducts = useMemo(() => {
    // More comprehensive null/undefined check
    if (!sampleProducts?.data?.length) {
      return [];
    }
  
    return sampleProducts.data.map((product) => {
      // Safely handle all potentially null/undefined fields
      return {
        id: product.id || '',
        name: product.name || 'Unnamed Product',
        // Add all other product fields you need with fallbacks
        ...product,
        quantity: product.totalStock || 0, // Provide fallback for totalStock
        supplierName: product.supplier?.name || "Unknown Supplier",
        supplierNumber: product.supplier?.phone || "N/A",
        // Add any other transformed fields
      };
    });
  }, [sampleProducts]); // Use the full object as dependency

  const [products, setProducts] = useState(transformedProducts);
  const [movements, setMovements] = useState(sampleMovements);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");

  // Get unique locations from all products
  const locations = useMemo(() => {
    const locSet = new Set();
    products.forEach((product) => {
      product.stock.forEach((stockItem) => {
        locSet.add(stockItem.location);
      });
    });
    return ["all", ...Array.from(locSet)];
  }, [products]);

  // Update the memoized derived values to use the new structure
  const { totalItems, lowStockCount, outOfStockCount, totalValue } =
    useMemo(() => {
      const totalItems = products.reduce(
        (sum, product) => sum + product.totalStock,
        0
      );
      const lowStockCount = products.filter(
        (p) => p.totalStock > 0 && p.totalStock <= p.reorderLevel
      ).length;
      const outOfStockCount = products.filter((p) => p.totalStock === 0).length;
      const totalValue = products.reduce(
        (sum, product) => sum + product.sellingPrice * product.totalStock,
        0
      );

      return { totalItems, lowStockCount, outOfStockCount, totalValue };
    }, [products]);

  // Update the filtered products logic to use totalStock
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by stock status
    if (activeTab === "low-stock") {
      filtered = filtered.filter(
        (p) => p.totalStock > 0 && p.totalStock <= p.reorderLevel
      );
    } else if (activeTab === "out-of-stock") {
      filtered = filtered.filter((p) => p.totalStock === 0);
    }

    // Filter by location
    if (activeLocation !== "all") {
      filtered = filtered.filter((product) =>
        product.stock.some(
          (stockItem) =>
            stockItem.location === activeLocation && stockItem.quantity > 0
        )
      );
    }

    return filtered;
  }, [products, activeTab, activeLocation]);

  // Function to open adjust stock modal
  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setIsAdjustModalOpen(true);
  };

  // Update the handleStockAdjust function to work with the new structure
  const handleStockAdjust = (adjustmentData) => {
    const { productId, location, adjustmentType, quantity, notes } =
      adjustmentData;

    // Find the product
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Create a new movement record
    const newMovement = {
      id: (movements.length + 1).toString(),
      productId,
      productName: product.name,
      sku: product.sku,
      type: adjustmentType,
      quantity: adjustmentType === "Decrease" ? -quantity : quantity,
      location,
      date: new Date().toISOString(),
      notes,
    };

    // Add transfer destination if it's a transfer
    if (adjustmentType === "Transfer") {
      newMovement.toLocation = adjustmentData.toLocation;
    }

    // Update movements
    setMovements([newMovement, ...movements]);

    // Update product stock
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        if (p.id !== productId) return p;

        // Clone the stock array
        const newStock = [...p.stock];

        // Handle different adjustment types
        if (adjustmentType === "Increase" || adjustmentType === "Decrease") {
          // Find the location index
          const locationIndex = newStock.findIndex(
            (s) => s.location === location
          );

          if (locationIndex >= 0) {
            // Update existing location
            const newQuantity =
              adjustmentType === "Increase"
                ? newStock[locationIndex].quantity + quantity
                : Math.max(0, newStock[locationIndex].quantity - quantity);

            newStock[locationIndex] = {
              ...newStock[locationIndex],
              quantity: newQuantity,
            };
          } else if (adjustmentType === "Increase") {
            // Add new location if increasing
            newStock.push({ location, quantity });
          }
        } else if (adjustmentType === "Transfer") {
          // Find source location
          const sourceIndex = newStock.findIndex(
            (s) => s.location === location
          );
          if (sourceIndex < 0 || newStock[sourceIndex].quantity < quantity)
            return p;

          // Decrease from source
          newStock[sourceIndex] = {
            ...newStock[sourceIndex],
            quantity: newStock[sourceIndex].quantity - quantity,
          };

          // Find or create destination
          const destIndex = newStock.findIndex(
            (s) => s.location === adjustmentData.toLocation
          );
          if (destIndex >= 0) {
            // Update existing destination
            newStock[destIndex] = {
              ...newStock[destIndex],
              quantity: newStock[destIndex].quantity + quantity,
            };
          } else {
            // Create new destination
            newStock.push({ location: adjustmentData.toLocation, quantity });
          }
        }

        // Calculate new total quantity
        const newTotalStock = newStock.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        return {
          ...p,
          stock: newStock,
          totalStock: newTotalStock,
          quantity: newTotalStock, // Keep quantity in sync with totalStock
          lastUpdated: new Date().toISOString(),
        };
      });
    });

    setIsAdjustModalOpen(false);
  };

  // Update the export function to use the new structure
  const handleExport = () => {
    // Format data for export
    const formattedData = filteredProducts.map((product) => {
      const stockByLocation = {};

      // Create columns for each location
      product.stock.forEach((stockItem) => {
        stockByLocation[stockItem.location] = stockItem.quantity;
      });

      return {
        "Product ID": product.id,
        Name: product.name,
        SKU: product.sku,
        Category: product.category,
        "Total Quantity": product.totalStock,
        "Reorder Level": product.reorderLevel,
        "Cost Price (₦)": product.costPrice.toLocaleString(),
        "Selling Price (₦)": product.sellingPrice.toLocaleString(),
        "Total Value (₦)": (
          product.sellingPrice * product.totalStock
        ).toLocaleString(),
        Supplier: product.supplier?.name || "Unknown Supplier",
        "Last Updated": product.lastUpdated
          ? format(new Date(product.lastUpdated), "yyyy-MM-dd HH:mm:ss")
          : "-",
        ...stockByLocation,
      };
    });

    // Generate filename
    const filename = `inventory_export_${format(new Date(), "yyyy-MM-dd")}.csv`;

    // Export to CSV
    exportToCSV(formattedData, filename);
  };

  // Update the inventory columns to use the new structure
  const inventoryColumns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="flex w-full max-w-[180px] font-medium">
              {row.getValue("name")}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.sku}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        id: "stockLevels",
        header: "Stock Levels",
        cell: ({ row }) => {
          const product = row.original;
          const stockDetails = product.stock || [];

          return (
            <div className="space-y-1">
              {stockDetails.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.location}:</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t text-sm font-semibold">
                <span>Total:</span>
                <span>{product.totalStock}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "totalStock",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const totalStock = row.getValue("totalStock");
          const reorderLevel = row.original.reorderLevel;

          let status;
          let statusColor;
          if (totalStock === 0) {
            status = "Out of Stock";
            statusColor = "bg-red-100 text-red-800";
          } else if (totalStock <= reorderLevel) {
            status = "Low Stock";
            statusColor = "bg-yellow-100 text-yellow-800";
          } else {
            status = "In Stock";
            statusColor = "bg-green-100 text-green-800";
          }

          return (
            <Badge variant="outline" className={statusColor}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "prices",
        header: "Prices",
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Cost:</span>
                <span>₦{product.costPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Selling:</span>
                <span>₦{product.sellingPrice.toLocaleString()}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "value",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const product = row.original;
          const value = product.sellingPrice * product.totalStock;

          return <div className="font-medium">₦{value.toLocaleString()}</div>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const product = row.original;

          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAdjustModal(product)}
            >
              Adjust Stock
            </Button>
          );
        },
      },
    ],
    []
  );

  // Define movement columns
  const movementColumns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          format(new Date(row.getValue("date")), "MMM d, yyyy HH:mm"),
      },
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.getValue("productName")}</div>
            <div className="text-sm text-muted-foreground">
              {row.original.sku}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.getValue("type");
          let badgeColor;

          switch (type) {
            case "Received":
              badgeColor = "bg-green-100 text-green-800";
              break;
            case "Sold":
              badgeColor = "bg-blue-100 text-blue-800";
              break;
            case "Transfer":
              badgeColor = "bg-purple-100 text-purple-800";
              break;
            case "Adjustment":
            case "Decrease":
              badgeColor = "bg-red-100 text-red-800";
              break;
            case "Increase":
              badgeColor = "bg-green-100 text-green-800";
              break;
            default:
              badgeColor = "bg-gray-100 text-gray-800";
          }

          return (
            <Badge variant="outline" className={badgeColor}>
              {type}
            </Badge>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => {
          const quantity = row.getValue("quantity");
          const isNegative = quantity < 0;

          return (
            <span className={isNegative ? "text-red-600" : "text-green-600"}>
              {isNegative ? quantity : `+${quantity}`}
            </span>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
          const location = row.getValue("location");
          const toLocation = row.original.toLocation;

          return toLocation ? (
            <span>
              {location} → {toLocation}
            </span>
          ) : (
            <span>{location}</span>
          );
        },
      },
      {
        accessorKey: "notes",
        header: "Notes",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your stock levels
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => openAdjustModal(null)}
            className="bg-sky-400 text-black hover:bg-sky-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adjust Stock
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Items</CardTitle>
            <CardDescription>All inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
            <CardDescription>Below reorder level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Out of Stock</CardTitle>
            <CardDescription>Unavailable items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Inventory Value</CardTitle>
            <CardDescription>Total stock value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="low-stock">
                  Low Stock
                  {lowStockCount > 0 && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                      {lowStockCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="out-of-stock">
                  Out of Stock
                  {outOfStockCount > 0 && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-red-100 text-red-800 hover:bg-red-100"
                    >
                      {outOfStockCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              onValueChange={setActiveLocation}
            >
              <TabsList>
                {locations.map((location) => (
                  <TabsTrigger key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <ResponsiveDataTable
            columns={inventoryColumns}
            data={filteredProducts}
            searchField="name"
          />
        </TabsContent>

        <TabsContent value="movements">
          <ResponsiveDataTable
            columns={movementColumns}
            data={movements}
            searchField="productName"
          />
        </TabsContent>
      </Tabs>

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        product={selectedProduct}
        products={products}
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSave={handleStockAdjust}
        locations={locations.filter((loc) => loc !== "all")}
      />
    </div>
  );
}
