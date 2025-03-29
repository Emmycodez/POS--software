import React from "react";
import AddSupplier from "./_components/AddSupplier";
import { getSuppliers } from "@/actions/serverActions";
import SuppliersPage from "./_components/SupplierClient";

// {
//   id: "1",
//   name: "Tech Supplies Ltd.",
//   contactEmail: "contact@techsupplies.com",
//   phone: "08123456789",
//   countryCode: "+234",
//   address: "123 Tech Avenue, Lagos, Nigeria",
//   website: "https://techsupplies.com",
//   createdAt: "2023-10-15T09:30:00Z",
//   updatedAt: "2024-02-20T14:45:00Z",
// },

const Suppliers = async () => {
  const supplierData = await getSuppliers();

  return (
    <div className="h-screen py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Suppliers Page</h1>
        </div>
        <div>
          {/* <AddSupplier /> */}
        </div>
      </div>
      <div>
        {/* Products Table */}
        <SuppliersPage sampleSuppliers={supplierData?.data} />
      </div>
    </div>
  );
};

export default Suppliers;
