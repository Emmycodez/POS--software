import { getServerSession } from "next-auth";
import InventoryPageClient from "./_components/InventoryPageClient";
import { authOptions } from "@/lib/authOptions";

const InventoryPage = async () => {
  const session = await getServerSession(authOptions);
  console.log("This is the inventory session: ", session)
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
      {<InventoryPageClient sesssion={session}/>}
    </div>
  );
};

export default InventoryPage;
