import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getProducts } from "@/actions/serverActions";
import { ResponsiveDataTable } from "../responsive-data-table";

export default async function ProductTable() {
  // const data = [
  //   {
  //     id: "1",
  //     name: "Wireless Mouse",
  //     sku: "ELE-MOU-1234",
  //     description: "A high-precision wireless mouse with ergonomic design.",
  //     quantity: 50,
  //     reorderLevel: 10,
  //     supplierName: "Tech Supplies Ltd.",
  //     supplierNumber: "08123456789",
  //     price: 7500, // Price in Naira
  //   },
  //   {
  //     id: "2",
  //     name: "Mechanical Keyboard",
  //     sku: "ELE-KBD-5678",
  //     description: "RGB backlit mechanical keyboard with blue switches.",
  //     quantity: 30,
  //     reorderLevel: 5,
  //     supplierName: "Keyboard World",
  //     supplierNumber: "08098765432",
  //     price: 25000,
  //   },
  //   {
  //     id: "3",
  //     name: "Office Chair",
  //     sku: "FUR-CHR-4321",
  //     description: "Adjustable office chair with lumbar support.",
  //     quantity: 20,
  //     reorderLevel: 5,
  //     supplierName: "Comfort Seating Ltd.",
  //     supplierNumber: "07045678901",
  //     price: 55000,
  //   },
  //   {
  //     id: "4",
  //     name: "External Hard Drive",
  //     sku: "ELE-HDD-8765",
  //     description: "1TB external hard drive with USB 3.0 support.",
  //     quantity: 15,
  //     reorderLevel: 3,
  //     supplierName: "Storage Solutions Inc.",
  //     supplierNumber: "08111222333",
  //     price: 35000,
  //   },
  //   {
  //     id: "5",
  //     name: "LED Monitor",
  //     sku: "ELE-MON-3456",
  //     description: "27-inch LED monitor with 144Hz refresh rate.",
  //     quantity: 25,
  //     reorderLevel: 7,
  //     supplierName: "Display Tech Co.",
  //     supplierNumber: "09033445566",
  //     price: 90000,
  //   },
  // ];
  const res = await getProducts();
  const data = res?.data
  console.log("This is the data sent to the products table: ", data);
  return (
    <div className="container mx-auto py-10">
      < DataTable columns={columns} data={data} />
    </div>
  );
}
