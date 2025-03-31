import { getProducts } from "@/actions/serverActions";
import CreateProducts from "./_components/CreateProducts";
import ProductsTable from "./_components/ProductsTable";
const ProductsPage = async () => {
  const data = await getProducts();
  console.log("This is the data gotten from the products page: ", data)
  return (
    <div className="h-screen py-4 px-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Products Page</h1>
        </div>
        <div>
          <CreateProducts />
        </div>
      </div>
      <div>
        {/* Products Table */}
        {data && <ProductsTable sampleProducts={data} />}
      </div>
    </div>
  );
};

export default ProductsPage;
