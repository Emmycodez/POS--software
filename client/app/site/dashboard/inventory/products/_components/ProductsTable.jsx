"use client"

import { useState } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveDataTable } from "@/components/responsive-data-table" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProductDetailsModal } from "./product-details-modal" 
import { AddEditProductModal } from "./add-edit-product-modal" 
import { productColumns } from "./columns" 
import { exportToCSV } from "@/lib/export-utils"
import { format } from "date-fns"

// Sample data - in a real app, this would come from your API


export default function ProductsTable({sampleProducts}) {
  const [products, setProducts] = useState(sampleProducts?.data);
 
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

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
      dataToExport = products.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel)
    } else if (activeTab === "out-of-stock") {
      dataToExport = products.filter((p) => p.quantity === 0)
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
        "Price (₦)": product.price.toLocaleString(),
        Supplier: product.supplierName,
        "Supplier Contact": product.supplierNumber,
        "Last Updated":product.lastUpdated ? format(new Date(product.lastUpdated), "yyyy-MM-dd HH:mm:ss"): "-",
      }
    })

    // Generate filename
    const filename = `products_export_${format(new Date(), "yyyy-MM-dd")}.csv`

    // Export to CSV
    exportToCSV(formattedData, filename)
  }

  // Calculate summary statistics
  const totalProducts = products.length
  const lowStockCount = products.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel).length
  const outOfStockCount = products.filter((p) => p.quantity === 0).length
  const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0)

  // Create columns with action handlers
  const columns = productColumns({
    onView: viewProductDetails,
    onEdit: editProduct,
    onDelete: deleteProduct,
  })

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product inventory</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          {/* <Button onClick={addProduct} className="bg-sky-400 text-black hover:bg-sky-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button> */}
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
          <ResponsiveDataTable columns={columns} data={products} searchField="name" />
        </TabsContent>

        <TabsContent value="low-stock">
          <ResponsiveDataTable
            columns={columns}
            data={products.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel)}
            searchField="name"
          />
        </TabsContent>

        <TabsContent value="out-of-stock">
          <ResponsiveDataTable columns={columns} data={products.filter((p) => p.quantity === 0)} searchField="name" />
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
    </div>
  )
}

