import { Product } from "../database/schema.js";

const formatInventoryData = (inventory) => {
  return inventory.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    quantity: product.quantity || 0,
    reorderLevel: product.reorderLevel || 0,
    location: product.location || "N/A", // Adjust based on your data structure
    status: product.quantity <= product.reorderLevel ? "Low Stock" : "In Stock",
  }));
};

export const getInventory = async (req, res) => {
  try {
    const inventory = await Product.find();
    res.status(200).json(formatInventoryData(inventory));
  } catch (error) {
    console.error("Failed to fetch inventory data: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateInventory = async (req, res) => {
  console.log("Hitting the update inventory controller");
  try {
    const { id, newQuantity } = req.body;

    // Validate request data
    if (!id || !newQuantity) {
      return res.status(400).json({
        message: "Send all required fields: id and newQuantity",
      });
    }

    // Convert newQuantity to a number
    const parsedQuantity = Number(newQuantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({
        message: "Invalid quantity. It must be a non-negative number.",
      });
    }

    // Find and update product
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Invalid product ID, product not found" });
    }

    product.quantity = parsedQuantity;
    await product.save();

    return res.status(200).json({
      message: "Inventory updated successfully",
      product,
    });
  } catch (error) {
    console.error("Failed to update inventory stock quantity:", error.message);

    return res.status(500).json({ message: "Internal server error" });
  }
};
