import {getProducts, getSuppliers } from "@/actions/NextServerActions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import CreateProducts from "./_components/CreateProducts";
import ProductsTable from "./_components/ProductsTable";

const ProductsPage = async () => {
  const session = await getServerSession(authOptions);
  console.log("Session data:", session);
  
  const currentBusiness = session?.user?.currentBusiness;
  const selectedLocation = session?.user?.selectedLocation;
  console.log("Selected location: ", selectedLocation)
  
  // Validate required data
  if (!currentBusiness || !selectedLocation) {
    console.error("Missing required data:", {
      currentBusiness,
      selectedLocation
    });
    return (
      <div className="p-4 text-red-500">
        Cannot load products - missing business or location information.
        Please ensure you've selected a business and location.
      </div>
    );
  }

  // Fetch data in parallel
  const [products, suppliers] = await Promise.all([
    getProducts(currentBusiness, selectedLocation),
    getSuppliers(currentBusiness)
  ]);

  console.log("Loaded data:", { products, suppliers });

  return (
    <div className="h-screen py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Products Page</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <CreateProducts
            locations={session?.user?.locations}
            suppliers={suppliers}
            currentBusiness={currentBusiness}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>
      <div>
        {/* Products Table */}
         <ProductsTable sampleProducts={products || []} />
      </div>
    </div>
  );
};

export default ProductsPage;
