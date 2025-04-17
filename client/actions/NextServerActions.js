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

await Product.collection.dropIndex('sku_1').catch(() => {});

// Create new compound index
await Product.collection.createIndex(
  { sku: 1, business: 1 }, 
  { unique: true, name: 'sku_business_unique' }
);


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

    // Loop through each location to create a separate product
    for (const item of locationStock) {
      const { locationId, quantity } = item;

      // Create the product for the specific location
      const newProduct = new Product({
        name: productName,
        sku: stockKeepingUnit, // optional: add location suffix to avoid SKU conflict
        description: productDescription,
        category,
        reorderLevel,
        supplier,
        business: businessId,
        location: locationId, // 👈 KEY: tie product to this location
        expiryDate: batchExpiry,
      });

      await newProduct.save();

      // Create product price
      const productPrice = new ProductPrice({
        product: newProduct._id,
        business: businessId,
        sellingPrice: productSellingPrice,
        costPrice: productCostPrice,
      });

      await productPrice.save();

      // Create batch for the specific location
      await ProductBatch.create({
        product: newProduct._id,
        batchNumber,
        expiryDate: batchExpiry,
        quantity,
        location: locationId,
      });

      // Create/update stock at this location
      await ProductStock.findOneAndUpdate(
        { product: newProduct._id, location: locationId },
        { $inc: { quantity } },
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      message: "Products created successfully per location.",
    };
  } catch (error) {
    console.error("Failed to create product: ", error.message);
    return {
      success: false,
      message: error.message || "Internal server error",
    };
  }
};

export const getProducts = async (currentBusiness, selectedLocation ) => {
  try {
    // 1. Validate input parameters
    if (!currentBusiness || !selectedLocation) {
      console.error('Missing required parameters:', {
        currentBusiness,
        selectedLocation
      });
      return { error: 'Missing business or location ID' };
    }

    // 2. Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(currentBusiness) || 
        !mongoose.Types.ObjectId.isValid(selectedLocation)) {
      console.error('Invalid ID format:', {
        currentBusiness,
        selectedLocation
      });
      return { error: 'Invalid business or location ID format' };
    }

    // 3. Connect to database
    await connectToDB();
    console.log(`Fetching products for business ${currentBusiness} at location ${selectedLocation}`);

    // 4. Create ObjectIds
    const businessObjectId = new mongoose.Types.ObjectId(currentBusiness);
    const locationObjectId = new mongoose.Types.ObjectId(selectedLocation);

    // 5. Fetch products with supplier data
    const products = await Product.find({
      business: currentBusiness,
      location: selectedLocation,
    }).populate('supplier');

    if (!products.length) {
      console.log('No products found for the given criteria');
      return { data: [] };
    }

    // 6. Prepare for parallel fetching
    const productIds = products.map((p) => p._id);
    
    // 7. Fetch prices and stocks in parallel
    const [prices, stocks] = await Promise.all([
      ProductPrice.find({ product: { $in: productIds } }),
      ProductStock.find({
        product: { $in: productIds },
        location: locationObjectId,
      }).populate('location', 'name')
    ]);

    // 8. Create lookup maps
    const priceMap = prices.reduce((map, price) => {
      map[price.product.toString()] = price;
      return map;
    }, {});

    const stockMap = stocks.reduce((map, stock) => {
      const productId = stock.product.toString();
      map[productId] = map[productId] || [];
      map[productId].push({
        location: stock.location?.name || 'Unknown',
        quantity: stock.quantity,
        locationId: stock.location?._id.toString(),
      });
      return map;
    }, {});

    // 9. Format the response
    const formattedProducts = products.map((product) => {
      const productId = product._id.toString();
      const priceData = priceMap[productId] || {};
      const stockData = stockMap[productId] || [];

      return {
        id: productId,
        name: product.name,
        sku: product.sku,
        description: product.description,
        category: product.category,
        reorderLevel: product.reorderLevel,
        supplier: {
          id: product.supplier?._id.toString(),
          name: product.supplier?.name
        },
        supplierNumber: product.supplier?.countryCode + product.supplier?.phone || 'N/A',
        supplierName: product.supplier?.name || 'Unknown supplier',
        costPrice: priceData.costPrice || 0,
        sellingPrice: priceData.sellingPrice || 0,
        currency: priceData.currency || 'NGN',
        lastUpdated: product.updatedAt,
        stock: stockData,
        totalStock: stockData.reduce((sum, item) => sum + item.quantity, 0),
        batches: [],
      };
    });

    console.log(`Successfully fetched ${formattedProducts.length} products`);
    return { data: formattedProducts };

  } catch (error) {
    console.error('Error in getProducts:', error);
    return { error: error.message || 'Failed to fetch products' };
  }
};
