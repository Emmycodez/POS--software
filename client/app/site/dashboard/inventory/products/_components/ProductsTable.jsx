"use client"

import { useState, useMemo } from "react"
import { Plus, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveDataTable } from "@/components/responsive-data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProductDetailsModal } from "./product-details-modal"
import { AddEditProductModal } from "./add-edit-product-modal"
import { ImportCSVModal } from "./import-csv-modal"
import { productColumns } from "./columns"
import { exportToCSV } from "@/lib/export-utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Sample data that matches your backend structure
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

export default function ProductsTable({sampleProducts}) {
  const { toast } = useToast()

  // Transform the data to include a quantity field for the UI - use useMemo to avoid recalculation on every render
  const transformedProducts = useMemo(() => {
    return sampleProducts.data.map((product) => {
      // Calculate total quantity across all locations
      const totalQuantity = product.stock.reduce((sum, stockItem) => sum + stockItem.quantity, 0)

      return {
        ...product,
        quantity: totalQuantity, // Add a quantity field for the UI
      }
    })
  }, [])

  const [products, setProducts] = useState(transformedProducts)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  // Memoize derived values to prevent recalculation on every render
  const { totalProducts, lowStockCount, outOfStockCount, totalValue } = useMemo(() => {
    const totalProducts = products.length
    const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel).length
    const outOfStockCount = products.filter((p) => p.quantity === 0).length
    const totalValue = products.reduce((sum, product) => sum + product.sellingPrice * product.quantity, 0)

    return { totalProducts, lowStockCount, outOfStockCount, totalValue }
  }, [products])

  // Memoize filtered data for each tab
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel),
    [products],
  )

  const outOfStockProducts = useMemo(() => products.filter((p) => p.quantity === 0), [products])

  // Function to view product details
  const viewProductDetails = (product) => {
    setSelectedProduct(product)
    setIsDetailsModalOpen(true)
  }

  // Function to open edit product modal
  const editProduct = (product) => {
    setEditingProduct(product)
    setIsAddEditModalOpen(true)
  }

  // Function to open add product modal
  const addProduct = () => {
    setEditingProduct(null)
    setIsAddEditModalOpen(true)
  }

  // Function to handle product save (add/edit)
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === productData.id ? productData : p)))
    } else {
      // Add new product with generated ID
      const newProduct = {
        ...productData,
        id: (products.length + 1).toString(),
        lastUpdated: new Date().toISOString(),
        // Initialize with empty stock if not provided
        stock: productData.stock || [
          { location: "Main Warehouse", quantity: productData.quantity || 0 },
          { location: "Store Front", quantity: 0 },
        ],
      }
      setProducts([...products, newProduct])
    }
    setIsAddEditModalOpen(false)
  }

  // Function to handle product delete
  const deleteProduct = (productId) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  // Function to handle export
  const handleExport = () => {
    // Get the current filtered data based on active tab
    let dataToExport = [...products]
    if (activeTab === "low-stock") {
      dataToExport = lowStockProducts
    } else if (activeTab === "out-of-stock") {
      dataToExport = outOfStockProducts
    }

    // Format data for export
    const formattedData = dataToExport.map((product) => {
      return {
        "Product ID": product.id,
        Name: product.name,
        SKU: product.sku,
        Category: product.category,
        Description: product.description,
        Quantity: product.quantity,
        "Reorder Level": product.reorderLevel,
        "Price (₦)": product.sellingPrice.toLocaleString(),
        Supplier: product.supplierName,
        "Supplier Contact": product.supplierNumber,
        "Last Updated": product.lastUpdated ? format(new Date(product.lastUpdated), "yyyy-MM-dd HH:mm:ss") : "-",
        "Stock Details": product.stock.map((s) => `${s.location}: ${s.quantity}`).join(", "),
      }
    })

    // Generate filename
    const filename = `products_export_${format(new Date(), "yyyy-MM-dd")}.csv`

    // Export to CSV
    exportToCSV(formattedData, filename)
  }

  // Function to handle import
  const handleImport = (importedProducts) => {
    // Check for duplicate SKUs
    const existingSkus = new Set(products.map((p) => p.sku))
    const newProducts = []
    const updatedProducts = []

    importedProducts.forEach((product) => {
      if (existingSkus.has(product.sku)) {
        // Update existing product
        updatedProducts.push(product)
      } else {
        // Add as new product
        newProducts.push(product)
      }
    })

    // Update state with new and updated products
    setProducts((prevProducts) => {
      // First, update existing products
      const updatedState = prevProducts.map((p) => {
        const match = updatedProducts.find((up) => up.sku === p.sku)
        return match ? { ...match, id: p.id } : p
      })

      // Then add new products
      return [...updatedState, ...newProducts]
    })

    // Show success toast
    toast({
      title: "Import Successful",
      description: `Added ${newProducts.length} new products and updated ${updatedProducts.length} existing products.`,
    })
  }

  // Create columns with action handlers - memoize to prevent recreation on every render
  const columns = useMemo(
    () =>
      productColumns({
        onView: viewProductDetails,
        onEdit: editProduct,
        onDelete: deleteProduct,
      }),
    [
      /* dependencies are stable functions, so no dependencies needed */
    ],
  )

  // Function to get stock location details as a formatted string
  const getStockLocationString = (product) => {
    if (!product.stock || product.stock.length === 0) return "No stock information"

    return product.stock.map((item) => `${item.location}: ${item.quantity}`).join(", ")
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button onClick={addProduct} className="bg-sky-400 text-black hover:bg-sky-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
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
            <CardTitle className="text-lg">Total Products</CardTitle>
            <CardDescription>All inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
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
            <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">
            Low Stock
            {lowStockCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                {lowStockCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="out-of-stock">
            Out of Stock
            {outOfStockCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                {outOfStockCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ResponsiveDataTable
            columns={columns}
            data={products}
            searchField="name"
            getStockLocationString={getStockLocationString}
          />
        </TabsContent>

        <TabsContent value="low-stock">
          <ResponsiveDataTable
            columns={columns}
            data={lowStockProducts}
            searchField="name"
            getStockLocationString={getStockLocationString}
          />
        </TabsContent>

        <TabsContent value="out-of-stock">
          <ResponsiveDataTable
            columns={columns}
            data={outOfStockProducts}
            searchField="name"
            getStockLocationString={getStockLocationString}
          />
        </TabsContent>
      </Tabs>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Add/Edit Product Modal */}
      <AddEditProductModal
        product={editingProduct}
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Import CSV Modal */}
      <ImportCSVModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />
    </div>
  )
}

