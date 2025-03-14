import { Product, ProductPrice } from "../database/schema.js";

export const getPosProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const formattedPosProduct = await Promise.all(
      products.map(async (product) => {

        // fetch product price
        const productPrice = await ProductPrice.findOne({
          product:product._id
        });

        // TODO: Add imagegs to product schema and Add image upload functionality

        // return id, name, price, quantity, category, image
        return {
          id: product._id.toString(),
          name: product.name,
          price: parseInt(productPrice?.price) || 0,
          quantity: product.quantity,
          category: product.category,
          image: product.image || "/N/A"
        }
      })
    );

    return res.status(200).json({data: formattedPosProduct})
  } catch (error) {
    console.error("Failed to fetch POS products", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
