import { getInventory, getProducts } from "@/actions/serverActions";
import { DataTable } from "@/components/data-table/data-table";
import React from "react";
import { inventoryColumns } from "./_components/inventoryColumns";
import InventoryPageClient from "./_components/InventoryPageClient";

const InventoryPage = async () => {
  const data = await getProducts();

  // const handleStockUpdate = async (id, newQuantity) => {
  //   await UpdateStockModal();
  // }

  return (
    <div className="h-screen py-4 px-6 mb-4 border-b">
      <div className="flex justify-between items-center mb-4 border-b">
        <div className="py-4">
          <h1 className="text-3xl font-bold uppercase">Inventory Page</h1>
        </div>
        {/* <div>
          <CreateProducts />
        </div> */}
      </div>
      {data && <InventoryPageClient sampleProducts={data} />}
    </div>
  );
};

export default InventoryPage;
