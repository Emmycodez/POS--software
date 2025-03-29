"use client";

import { useState } from "react";
import { Plus, Download, Search, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResponsiveDataTable } from "@/components/responsive-data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SupplierDetailsModal } from "./supplier-details-modal";
import { AddEditSupplierModal } from "./add-edit-supplier-modal";
import { supplierColumns } from "./columns";
import { exportToCSV } from "@/lib/export-utils";
import { format } from "date-fns";
import { createSupplier } from "@/actions/serverActions";

// // Sample data based on the MongoDB schema
// const sampleSuppliers = [
//   {
//     id: "1",
//     name: "Tech Supplies Ltd.",
//     contactEmail: "contact@techsupplies.com",
//     phone: "08123456789",
//     countryCode: "+234",
//     address: "123 Tech Avenue, Lagos, Nigeria",
//     website: "https://techsupplies.com",
//     createdAt: "2023-10-15T09:30:00Z",
//     updatedAt: "2024-02-20T14:45:00Z",
//   },
//   {
//     id: "2",
//     name: "Office Solutions Inc.",
//     contactEmail: "info@officesolutions.com",
//     phone: "07045678901",
//     countryCode: "+234",
//     address: "45 Business Park, Abuja, Nigeria",
//     website: "https://officesolutions.com",
//     createdAt: "2023-11-05T11:20:00Z",
//     updatedAt: "2024-03-10T09:15:00Z",
//   },
//   {
//     id: "3",
//     name: "Global Electronics",
//     contactEmail: "sales@globalelectronics.com",
//     phone: "09087654321",
//     countryCode: "+234",
//     address: "78 Industrial Way, Port Harcourt, Nigeria",
//     website: "https://globalelectronics.com",
//     createdAt: "2023-09-22T13:45:00Z",
//     updatedAt: "2024-01-15T16:30:00Z",
//   },
//   {
//     id: "4",
//     name: "Comfort Seating Ltd.",
//     contactEmail: "support@comfortseating.com",
//     phone: "08055443322",
//     countryCode: "+234",
//     address: "15 Furniture Lane, Kano, Nigeria",
//     website: "https://comfortseating.com",
//     createdAt: "2024-01-10T10:00:00Z",
//     updatedAt: "2024-03-05T11:20:00Z",
//   },
//   {
//     id: "5",
//     name: "Storage Solutions Inc.",
//     contactEmail: "info@storagesolutions.com",
//     phone: "07033221144",
//     countryCode: "+234",
//     address: "32 Warehouse Road, Ibadan, Nigeria",
//     website: "https://storagesolutions.com",
//     createdAt: "2023-12-18T15:30:00Z",
//     updatedAt: "2024-02-28T09:45:00Z",
//   },
//   {
//     id: "6",
//     name: "Display Tech Co.",
//     contactEmail: "sales@displaytech.com",
//     phone: "09011223344",
//     countryCode: "+234",
//     address: "55 Digital Plaza, Enugu, Nigeria",
//     website: "https://displaytech.com",
//     createdAt: "2023-08-30T14:15:00Z",
//     updatedAt: "2024-03-12T13:10:00Z",
//   },
//   {
//     id: "7",
//     name: "Keyboard World",
//     contactEmail: "support@keyboardworld.com",
//     phone: "08099887766",
//     countryCode: "+234",
//     address: "22 Computer Street, Benin City, Nigeria",
//     website: "https://keyboardworld.com",
//     createdAt: "2023-10-05T09:20:00Z",
//     updatedAt: "2024-02-15T10:30:00Z",
//   },
//   {
//     id: "8",
//     name: "Network Systems Ltd.",
//     contactEmail: "info@networksystems.com",
//     phone: "07066554433",
//     countryCode: "+234",
//     address: "10 Connection Avenue, Kaduna, Nigeria",
//     website: "https://networksystems.com",
//     createdAt: "2023-11-22T11:45:00Z",
//     updatedAt: "2024-01-30T14:20:00Z",
//   },
// ]

export default function SuppliersPage({ sampleSuppliers }) {
  const [suppliers, setSuppliers] = useState(sampleSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Function to view supplier details
  const viewSupplierDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailsModalOpen(true);
  };

  // Function to open edit supplier modal
  const editSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setIsAddEditModalOpen(true);
  };

  // Function to open add supplier modal
  const addSupplier = () => {
    setEditingSupplier(null);
    setIsAddEditModalOpen(true);
  };

  // Function to handle supplier save (add/edit)
  const handleSaveSupplier = async (supplierData) => {
    if (editingSupplier) {
      // Update existing supplier
      setSuppliers(
        suppliers.map((s) =>
          s.id === supplierData.id
            ? {
                ...supplierData,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
    } else {
      // Add new supplier with generated ID
      const newSupplier = {
        ...supplierData,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSuppliers([...suppliers, newSupplier]);
      const res = await createSupplier(newSupplier);
    }
    setIsAddEditModalOpen(false);
  };

  // Function to handle supplier delete
  const deleteSupplier = (supplierId) => {
    setSuppliers(suppliers.filter((s) => s.id !== supplierId));
  };

  // Function to handle export
  const handleExport = () => {
    // Format data for export
    const formattedData = suppliers.map((supplier) => {
      return {
        "Supplier ID": supplier.id,
        Name: supplier.name,
        Email: supplier.contactEmail || "N/A",
        Phone: supplier.countryCode
          ? `${supplier.countryCode} ${supplier.phone}`
          : supplier.phone,
        Address: supplier.address || "N/A",
        Website: supplier.website || "N/A",
        "Created At": format(
          new Date(supplier.createdAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
        "Last Updated": format(
          new Date(supplier.updatedAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
      };
    });

    // Generate filename
    const filename = `suppliers_export_${format(new Date(), "yyyy-MM-dd")}.csv`;

    // Export to CSV
    exportToCSV(formattedData, filename);
  };

  // Calculate summary statistics
  const totalSuppliers = suppliers.length;
  const suppliersWithWebsite = suppliers.filter((s) => s.website).length;
  const suppliersWithEmail = suppliers.filter((s) => s.contactEmail).length;

  // Create columns with action handlers
  const columns = supplierColumns({
    onView: viewSupplierDetails,
    onEdit: editSupplier,
    onDelete: deleteSupplier,
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product suppliers
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={addSupplier}
            className="bg-sky-400 text-black hover:bg-sky-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Suppliers</CardTitle>
            <CardDescription>All registered suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">With Website</CardTitle>
            <CardDescription>Suppliers with online presence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{suppliersWithWebsite}</div>
              <Globe className="ml-2 h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">With Email</CardTitle>
            <CardDescription>Suppliers with email contact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{suppliersWithEmail}</div>
              <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="mb-4">
        <div className="flex items-center">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="max-w-sm"
            onChange={(e) => {
              // In a real app, you would implement search functionality here
              // For now, we'll just log the search term
              console.log("Searching for:", e.target.value)
            }}
          />
        </div>
      </div> */}

      <ResponsiveDataTable
        columns={columns}
        data={suppliers}
        searchField="name"
      />

      {/* Supplier Details Modal */}
      <SupplierDetailsModal
        supplier={selectedSupplier}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={editSupplier}
      />

      {/* Add/Edit Supplier Modal */}
      <AddEditSupplierModal
        supplier={editingSupplier}
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveSupplier}
      />
    </div>
  );
}
