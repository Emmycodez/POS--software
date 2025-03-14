import ProductTable from "@/components/data-table/page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductsTable() {
  return (
    <div className="space-y-4">
      <ProductTable />
    </div>
  );
}
