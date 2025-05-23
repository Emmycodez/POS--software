"use server";

import { authOptions } from "@/lib/authOptions";
import {
  Business,
  Location,
  Product,
  ProductBatch,
  ProductPrice,
  ProductStock,
  Supplier,
  User,
} from "@/models/schema";
import { connectToDB } from "@/utils/database";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export const handleOnboarding = async (data) => {
  await connectToDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const { businessName, businessType, whatsappNumber, locations } = data;

  if (!businessName || !businessType || !whatsappNumber) {
    console.log("Required fields not sent to handle onboarding page");
    throw new Error("All required fields must be sent to handle onboarding");
  }

  // 1. Create the business first with no locations yet
  const business = await Business.create({
    name: businessName,
    type: businessType,
    owner: userId,
    locations: [],
  });

  // 2. Create the locations with the business ID
  const createdLocations = await Promise.all(
    locations.map((loc) =>
      Location.create({
        ...loc,
        business: business._id,
      })
    )
  );

  // 3. Update the business with the created location IDs
  business.locations = createdLocations.map((loc) => loc._id);
  await business.save();

  // 4. Update the user with business info
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        whatsappNumber,
        onboarded: true,
        currentBusiness: business._id,
      },
      $push: {
        businesses: business._id,
      },
    },
    { new: true }
  );

  // 5. Update session manually (if needed by your system)
  session.user.whatsappNumber = whatsappNumber;
  session.user.currentBusiness = business._id.toString();
  session.user.businesses = [business._id.toString()];
  session.user.onboarded = true;
  session.user.locations = createdLocations.map((loc) => ({
    id: loc._id.toString(),
    name: loc.name,
  }));

  return { success: true };
};

export const getLocations = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const user = await User.findById(userId).populate({
    path: "currentBusiness",
    populate: { path: "locations" },
  });

  const locations = user.currentBusiness.locations.map((loc) => ({
    id: loc._id.toString(),
    name: loc.name,
  }));

  return locations;
};

export const setCurrentLocation = async (locationId) => {
  await connectToDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  // Save selected location to DB
  await User.findByIdAndUpdate(userId, {
    $set: { selectedLocation: locationId },
  });

  // Manually refresh the session after the update
  const updatedSession = await getServerSession(authOptions); // Refresh session

  // Optionally update session manually
  updatedSession.user.selectedLocation = locationId;

  return { success: true, session: updatedSession };
};

export const getSuppliers = async (businessId) => {
  try {
    await connectToDB();
    if (!businessId) {
      console.log("Business id is required to fetch suppliers");
      throw new Error("Invalid d Business ID");
    }

    const suppliers = await Supplier.find({ business: businessId }).lean();

    return suppliers.map((supplier) => ({
      id: supplier._id.toString(),
      name: supplier.name,
      contactEmail: supplier.contactEmail,
      phone: supplier.phone,
      countryCode: supplier.countryCode,
      address: supplier.address,
      website: supplier.website,
    }));
  } catch (error) {
    console.error("[getSuppliersByBusiness]", error);
    throw new Error("Failed to fetch suppliers");
  }
};

export const createSupplier = async (supplierData, businessId) => {
  try {
    await connectToDB();

    // Check if the required fields are provided
    if (!businessId || !supplierData) {
      throw new Error("Business ID and supplier data are required");
    }

    const { name, contactEmail, phone, countryCode, address, website } =
      supplierData;

    // Check if supplier already exists for the business by name and phone
    const existingSupplier = await Supplier.findOne({
      name,
      phone,
      business: businessId,
    });

    if (existingSupplier) {
      throw new Error(
        "Supplier with this name and phone already exists for this business"
      );
    }

    // Create new supplier
    const newSupplier = new Supplier({
      name,
      contactEmail,
      phone,
      countryCode,
      address,
      website,
      business: businessId,
    });

    await newSupplier.save();

    return {
      success: true,
      message: "Supplier created successfully",
      data: newSupplier,
    };
  } catch (error) {
    console.error("Failed to create supplier: ", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

export const createProduct = async (formData, businessId) => {
  try {
    await connectToDB();
    console.log("This is the form data sent to create a product: ", formData);

    if (!businessId || !formData) {
      throw new Error("Business ID and form data are required.");
    }

    const {
      productName,
      productSellingPrice,
      productCostPrice,
      productDescription,
      supplier,
      reorderLevel,
      category,
      stockKeepingUnit,
      batchNumber,
      batchExpiry,
      locationStock, // Array of { locationId, quantity }
    } = formData;

    // Step 1: Create the Product record
    const newProduct = new Product({
      name: productName,
      sku: stockKeepingUnit, // Single SKU for the product
      description: productDescription,
      category,
      reorderLevel,
      supplier,
      business: businessId,
      expiryDate: batchExpiry,
    });

    await newProduct.save();

    // Step 2: Create the ProductPrice record
    const productPrice = new ProductPrice({
      product: newProduct._id,
      business: businessId,
      sellingPrice: productSellingPrice,
      costPrice: productCostPrice,
    });

    await productPrice.save();

    // Step 3: Create ProductBatch record (track batch for the product)
    // Instead of one batch record, create one for each location
    for (const item of locationStock) {
      const { locationId, quantity } = item;

      await ProductBatch.create({
        product: newProduct._id,
        batchNumber,
        expiryDate: batchExpiry,
        quantity: quantity,
        location: locationId,
      });
    }
    // Step 4: Create ProductStock records for each location
    for (const item of locationStock) {
      const { locationId, quantity } = item;

      await ProductStock.create({
        product: newProduct._id,
        business: businessId,
        location: locationId,
        quantity, // Quantity of the product at this location
      });
    }

    return {
      success: true,
      message: "Product and stock created successfully per location.",
    };
  } catch (error) {
    console.error("Failed to create product: ", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

export const getProducts = async (currentBusiness, selectedLocation) => {
  try {
    // 1. Validate input parameters
    if (!currentBusiness || !selectedLocation) {
      console.error("Missing required parameters:", {
        currentBusiness,
        selectedLocation,
      });
      return { error: "Missing business or location ID" };
    }

    // 2. Validate MongoDB ID format
    if (
      !mongoose.Types.ObjectId.isValid(currentBusiness) ||
      !mongoose.Types.ObjectId.isValid(selectedLocation)
    ) {
      console.error("Invalid ID format:", {
        currentBusiness,
        selectedLocation,
      });
      return { error: "Invalid business or location ID format" };
    }

    // 3. Connect to database
    await connectToDB();

    // 4. Create ObjectIds
    const businessObjectId = new mongoose.Types.ObjectId(currentBusiness);
    const locationObjectId = new mongoose.Types.ObjectId(selectedLocation);

    // 5. First, fetch all products for this business
    const products = await Product.find({
      business: businessObjectId
    }).populate("supplier");

    if (!products.length) {
      console.log("No products found for the given business");
      return { data: [] };
    }

    // 6. Get product IDs for further queries
    const productIds = products.map(p => p._id);

    // 7. Fetch prices, stocks, and batches in parallel
    const [prices, stocks, batches] = await Promise.all([
      ProductPrice.find({ 
        product: { $in: productIds },
        business: businessObjectId 
      }),
      ProductStock.find({
        product: { $in: productIds },
        location: locationObjectId,
        business: businessObjectId
      }).populate("location", "name"),
      ProductBatch.find({
        product: { $in: productIds },
        location: locationObjectId
      })
    ]);

    // 8. Create lookup maps
    const priceMap = prices.reduce((map, price) => {
      map[price.product.toString()] = price;
      return map;
    }, {});

    const stockMap = stocks.reduce((map, stock) => {
      map[stock.product.toString()] = {
        location: stock.location?.name || "Unknown",
        quantity: stock.quantity,
        locationId: stock.location?._id.toString()
      };
      return map;
    }, {});

    const batchMap = batches.reduce((map, batch) => {
      const productId = batch.product.toString();
      map[productId] = map[productId] || [];
      map[productId].push({
        batchNumber: batch.batchNumber,
        expiryDate: batch.expiryDate,
        quantity: batch.quantity
      });
      return map;
    }, {});

    // 9. Format the response - only include products that have stock at the selected location
    const formattedProducts = products
      .filter(product => stockMap[product._id.toString()])
      .map(product => {
        const productId = product._id.toString();
        const priceData = priceMap[productId] || {};
        const stockData = stockMap[productId] || null;
        const batchData = batchMap[productId] || [];

        return {
          id: productId,
          name: product.name,
          sku: product.sku,
          description: product.description,
          category: product.category,
          reorderLevel: product.reorderLevel,
          supplier: {
            id: product.supplier?._id?.toString(),
            name: product.supplier?.name || "Unknown supplier",
            countryCode: product.supplier?.countryCode || "",
            phone: product.supplier?.phone || ""
          },
          supplierNumber: product.supplier?.countryCode && product.supplier?.phone 
            ? `${product.supplier.countryCode}${product.supplier.phone}` 
            : "N/A",
          supplierName: product.supplier?.name || "Unknown supplier",
          costPrice: priceData.costPrice || 0,
          sellingPrice: priceData.sellingPrice || 0,
          currency: priceData.currency || "NGN",
          lastUpdated: product.updatedAt,
          stock: stockData ? [stockData] : [],
          totalStock: stockData ? stockData.quantity : 0,
          batches: batchData,
          expiryDate: product.expiryDate
        };
      });

    return { data: formattedProducts };
  } catch (error) {
    console.error("Error in getProducts:", error);
    return { error: error.message || "Failed to fetch products" };
  }
};


export const deleteProduct = async (productId, businessId) => {
  try {
    // 1. Validate input parameters
    if (!productId || !businessId) {
      console.error("Missing required parameters:", { productId, businessId });
      return { 
        success: false, 
        message: "Product ID and Business ID are required" 
      };
    }

    // 2. Validate MongoDB ID format
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(businessId)
    ) {
      console.error("Invalid ID format:", { productId, businessId });
      return { 
        success: false, 
        message: "Invalid Product ID or Business ID format" 
      };
    }

    // 3. Connect to database
    await connectToDB();

    // 4. Create ObjectIds
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const businessObjectId = new mongoose.Types.ObjectId(businessId);

    // 5. Verify the product exists and belongs to the business
    const product = await Product.findOne({
      _id: productObjectId,
      business: businessObjectId
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found or does not belong to this business"
      };
    }

    // 6. Use a session to ensure all operations succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 7. Delete all associated records
      
      // Delete product prices
      await ProductPrice.deleteMany({
        product: productObjectId,
        business: businessObjectId
      }, { session });

      // Delete product stocks
      await ProductStock.deleteMany({
        product: productObjectId,
        business: businessObjectId
      }, { session });

      // Delete product batches
      await ProductBatch.deleteMany({
        product: productObjectId
      }, { session });

      // Delete the product itself
      await Product.deleteOne({
        _id: productObjectId,
        business: businessObjectId
      }, { session });

      // 8. Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Product and all associated records deleted successfully"
      };
    } catch (error) {
      // 9. If any operation fails, abort the transaction
      await session.abortTransaction();
      session.endSession();
      
      console.error("Transaction failed in deleteProduct:", error);
      return {
        success: false,
        message: "Failed to delete product: " + error.message
      };
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return { 
      success: false, 
      message: error.message || "Failed to delete product" 
    };
  }
};