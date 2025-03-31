import {
  ProductPrice,
  Supplier,
  Location,
  Product,
  ProductStock,
} from "../database/schema.js";

export const createProduct = async (req, res) => {
  try {
    console.log("This is the request body sent to create products: ", req.body);
    const {
      productName,
      productSellingPrice,
      productCostPrice,
      stock,
      supplier,
      supplierNumber,
      productDescription,
      reorderLevel,
      category,
      stockKeepingUnit,
    } = req.body;

    if (
      !productName ||
      !productSellingPrice ||
      !productCostPrice ||
      !stock ||
      !supplier ||
      !productDescription ||
      !reorderLevel ||
      !category ||
      !stockKeepingUnit
    ) {
      return res.status(400).json({
        message:
          "Send all required fields: productName, productSellingPrice, productCostPrice, Stock, supplier, productDescription, reorderLevel, category, stockKeepingUnit",
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
      reorderLevel,
      supplier: existingSupplier._id, // Store as ObjectId
    });

    await newProduct.save();

    // Create Product Price Entry
    const newProductPrice = new ProductPrice({
      product: newProduct._id,
      sellingPrice: productSellingPrice,
      costPrice: productCostPrice,
      currency: "NGN", // Assuming Naira
    });

    await newProductPrice.save();
    const stockEntries = await Promise.all(
      stock.map(async ({ locationId, quantity }) => {
        let location = await Location.findOne({ name: locationId });

        if (!location) {
          console.log(
            `Location "${locationId}" not found. Creating a new one.`
          );
          location = await Location.create({
            name: locationId,
            address: "Unknown", // You may want to improve this
          });
        }

        return {
          product: newProduct._id,
          location: location._id, // Store as ObjectId
          quantity,
        };
      })
    );

    await ProductStock.insertMany(stockEntries);

    console.log("Product created with stock data: ", req.body);

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
    // Fetch products and populate supplier details in one query
    const products = await Product.find().populate("supplier");
    
    // Get all product IDs for efficient batch queries
    const productIds = products.map(product => product._id);
    
    // Fetch all prices and stock information in batch queries
    const productPrices = await ProductPrice.find({ product: { $in: productIds } });
    const stockEntries = await ProductStock.find({ product: { $in: productIds } })
                               .populate('location', 'name');
    
    // Create lookup maps for efficient access
    const priceMap = productPrices.reduce((map, price) => {
      map[price.product.toString()] = price;
      return map;
    }, {});
    
    const stockMap = stockEntries.reduce((map, stock) => {
      const productId = stock.product.toString();
      if (!map[productId]) map[productId] = [];
      map[productId].push({
        location: stock.location?.name || "Unknown Location",
        quantity: stock.quantity,
        locationId: stock.location?._id
      });
      return map;
    }, {});
    
    // Transform the data
    const formattedProducts = products.map((product) => {
      const productId = product._id.toString();
      const productPrice = priceMap[productId];
      const stockData = stockMap[productId] || [];
      
      return {
        id: productId,
        name: product.name,
        sku: product.sku,
        description: product.description,
        reorderLevel: product.reorderLevel,
        supplierName: product.supplier?.name || "Unknown Supplier",
        category: product.category || "",
        supplierNumber: product.supplier?.phone || "N/A",
        costPrice: productPrice?.costPrice || 0,
        sellingPrice: productPrice?.sellingPrice || 0,
        lastUpdated: product.updatedAt,
        stock: stockData,
        // Total stock across all locations
        totalStock: stockData.reduce((sum, item) => sum + item.quantity, 0)
      };
    });

    return res.status(200).json({ data: formattedProducts });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};