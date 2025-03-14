import { Product } from "../database/schema.js";

import { ProductPrice } from "../database/schema.js";
import { Supplier } from "../database/schema.js";

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      stockQuantity,
      supplier,
      supplierNumber,
      productDescription,
      reorderLevel,
      category,
      stockKeepingUnit,
    } = req.body;

    if (
      !productName ||
      !productPrice ||
      !stockQuantity ||
      !supplier ||
      !productDescription ||
      !reorderLevel ||
      !category ||
      !stockKeepingUnit
    ) {
      return res.status(400).json({
        message:
          "Send all required fields: productName, productPrice, stockQuantity, supplier, productDescription, reorderLevel, category, stockKeepingUnit",
      });
    }

    // Check if supplier exists
    let existingSupplier = await Supplier.findOne({ name: supplier });
    if (!existingSupplier) {
      existingSupplier = await Supplier.create({
        name: supplier,
        phone: supplierNumber,
      });
    }

    // Create Product
    const newProduct = new Product({
      name: productName,
      sku: stockKeepingUnit,
      description: productDescription,
      category,
      quantity: stockQuantity,
      reorderLevel,
      supplier: existingSupplier._id, // Store as ObjectId
    });

    await newProduct.save();

    // Create Product Price Entry
    const newProductPrice = new ProductPrice({
      product: newProduct._id,
      price: productPrice,
      currency: "NGN", // Assuming Naira
    });

    await newProductPrice.save();

    console.log(
      "This is the data sent to the create product route: ",
      req.body
    );

    console.log("The create Products route was called");

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Failed to create product in the backend: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    // Fetch products and populate supplier details
    const products = await Product.find().populate("supplier");

    // Transform the data to include supplier details and price
    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        // Fetch product price
        const productPrice = await ProductPrice.findOne({ product: product._id });

        return {
          id: product._id.toString(),
          name: product.name,
          sku: product.sku,
          description: product.description,
          quantity: product.quantity,
          reorderLevel: product.reorderLevel,
          supplierName: product.supplier?.name || "Unknown Supplier",
          supplierNumber: product.supplier?.phone || "N/A",
          price: parseInt(productPrice?.price) || 0, // Default to 0 if no price found
        };
      })
    );

    // ✅ Send formatted data
    console.log("This is the data sent from the backend: ", formattedProducts);
    return res.status(200).json({ data: formattedProducts });

  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

