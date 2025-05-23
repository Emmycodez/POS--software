import { Product } from "@/models/schema";
import { connectToDB } from "@/utils/database";

const formatInventoryData = (inventory) => {
  return inventory.map((product) => ({
    id: product._id, // Use _id for MongoDB document ID
    name: product.name,
    sku: product.sku,
    quantity: product.quantity || 0,
    reorderLevel: product.reorderLevel || 0,
    location: product.location ? product.location.name : "N/A", // Assuming Location has a name field
    status: product.quantity <= product.reorderLevel ? "Low Stock" : "In Stock",
  }));
};

// Next.js Server Action - getInventory by location (with Business, User, and Location association)
export const getInventoryByLocation = async (
  businessId,
  locationId
) => {
  await connectToDB();
  try {
    if ((!businessId, locationId)) {
      console.log("You should have a business id, userid and location id");
      throw new Error(
        "Required fields must be sent to get inventory by location"
      );
    }

    // Query the products linked to the current business, user, and location
    const inventory = await Product.find({
      business: businessId,
      location: locationId,
    });
    const data = formatInventoryData(inventory);
    console.log("This is the data gotten from get inventory by location: ", inventory);
    return data;
  } catch (error) {
    console.error(
      "Failed to fetch inventory data by location: ",
      error.message
    );
    return { message: "Internal server error" };
  }
};
