import { getProducts, getSuppliers } from "@/actions/NextServerActions";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import CreateProducts from "./_components/CreateProducts";
import ProductsTable from "./_components/ProductsTable";

const ProductsPage = async () => {
  const session = await getServerSession(authOptions);

  const currentBusiness = session?.user?.currentBusiness;
  const selectedLocation = session?.user?.selectedLocation;

  // Validate required data
  if (!currentBusiness || !selectedLocation) {
    console.error("Missing required data:", {
      currentBusiness,
      selectedLocation,
    });
    return (
      <div className="p-4 text-red-500">
        Cannot load products - missing business or location information. Please
        ensure you&apos;ve selected a business and location.
      </div>
    );
  }

  // Fetch data in parallel
  const [products, suppliers] = await Promise.all([
    getProducts(currentBusiness, selectedLocation),
    getSuppliers(currentBusiness),
  ]);

  return (
    <div className="h-screen py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase text-primary">Products Page</h1>
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
        <ProductsTable
          sampleProducts={products || []}
          businessId={currentBusiness}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
