"use client";

import { DataTable } from "@/components/data-table/data-table";
import React, { useState } from "react";
import { inventoryColumns } from "./inventoryColumns";
import { updateInventory } from "@/actions/serverActions";

const InventoryPageClient = ({ data }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  return (
    <div className="py-4 ">
      {/* Products Table */}
      <DataTable
        selectedProduct={selectedProduct}
        isUpdateModalOpen={isUpdateModalOpen}
        columns={inventoryColumns(setSelectedProduct, setIsUpdateModalOpen)}
        data={data}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        onUpdate={updateInventory}
      />
    </div>
  );
};

export default InventoryPageClient;
