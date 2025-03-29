import { Supplier } from "../database/schema.js";

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    const formattedSuppliers = await Promise.all(
      suppliers.map(async (supplier) => {
        return {
          id: supplier._id.toString(),
          name: supplier.name,
          contactEmail: supplier.contactEmail || "",
          phone: supplier.phone || "",
          address: supplier.address || "",
          website: supplier.website || "",
          createdAt: supplier.createdAt,
          updatedAt: supplier.updatedAt,
        };
      })
    );

    return res.status(200).json({ data: formattedSuppliers });
  } catch (error) {
    console.error("Failed to fetch suppliers:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { name, contactEmail, phone, countryCode, address, website } =
      req.body;

    if (!name || !phone || !countryCode || !address) {
      console.log("All required fields not sent");
      return res.status(400).json({
        message:
          "Send all required fields: name, contactEmail, phone, countryCode, address",
      });
    }

    console.log("All required fields not sent");

    const newSupplier = new Supplier({
      name: name,
      contactEmail: contactEmail,
      phone: phone,
      countryCode: countryCode,
      address: address,
      website: website,
    });

    await newSupplier.save();
    return res
      .status(201)
      .json({ message: "supplier created successfully", supplier: newSupplier });
  } catch (error) {
    console.error("Failed to create supplier", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
