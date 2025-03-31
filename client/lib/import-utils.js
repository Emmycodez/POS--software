// Utility functions for importing CSV data
import Papa from "papaparse";

// Define the expected structure of a product (as a plain JavaScript object)
const validateAndTransformProducts = (csvData) => {
  const validProducts = [];
  const invalidRows = [];

  // Identify potential location columns in the CSV
  const locationColumns = [];
  if (csvData.length > 0) {
    const firstRow = csvData[0];
    const commonFields = [
      "id",
      "name",
      "sku",
      "description",
      "category",
      "sellingPrice",
      "costPrice",
      "reorderLevel",
      "supplierName",
      "supplierNumber",
      "quantity",
    ];

    // Any column that contains "location" or "warehouse" or "store" might be a location
    // Also any column not in common fields might be a location
    Object.keys(firstRow).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        !commonFields.includes(key) &&
        (lowerKey.includes("location") ||
          lowerKey.includes("warehouse") ||
          lowerKey.includes("store") ||
          lowerKey.includes("inventory"))
      ) {
        locationColumns.push(key);
      }
    });
  }

  csvData.forEach((row, index) => {
    const rowErrors = [];

    // Check required fields
    if (!row.name) rowErrors.push("Name is required");
    if (!row.sku) rowErrors.push("SKU is required");
    if (!row.sellingPrice) rowErrors.push("Selling Price is required");
    if (!row.costPrice) rowErrors.push("Cost Price is required");

    // Validate numeric fields
    const productCostPrice = Number.parseFloat(row.costPrice);
    if (isNaN(productCostPrice) || productCostPrice < 0)
      rowErrors.push("Cost Price must be a valid number");
    const productSellingPrice = Number.parseFloat(row.sellingPrice);
    if (isNaN(productSellingPrice) || productSellingPrice < 0)
      rowErrors.push("Selling Price must be a valid number");

    const reorderLevel = Number.parseInt(row.reorderLevel, 10);
    if (isNaN(reorderLevel) || reorderLevel < 0)
      rowErrors.push("Reorder Level must be a valid number");

    // If there are errors, add to invalid rows
    if (rowErrors.length > 0) {
      invalidRows.push({ row: index + 2, errors: rowErrors }); // +2 for header row and 0-indexing
      return;
    }

    // Process stock locations
    const locationStock = [];

    // First check if there's a single quantity field
    const totalQuantity =
      row.quantity !== undefined
        ? Number.parseInt(row.quantity, 10) || 0
        : null;

    // Check for specific location columns
    locationColumns.forEach((locationCol) => {
      if (row[locationCol] !== undefined && row[locationCol] !== "") {
        const quantity = Number.parseInt(row[locationCol], 10) || 0;
        locationStock.push({ location: locationCol, quantity });
      }
    });

    // Check for generic location columns format (Location:X)
    Object.keys(row).forEach((key) => {
      if (
        key.startsWith("Location:") &&
        row[key] !== undefined &&
        row[key] !== ""
      ) {
        const location = key.replace("Location:", "").trim();
        const quantity = Number.parseInt(row[key], 10) || 0;
        locationStock.push({ location, quantity });
      }
    });

    // If no locations found but we have a total quantity, use a default location
    if (locationStock.length === 0 && totalQuantity !== null) {
      locationStock.push({ location: "Default Storage", quantity: totalQuantity });
    }
    // If no locations or quantity specified, create a default with zero
    else if (locationStock.length === 0) {
      locationStock.push({ location: "Default Storage", quantity: 0 });
    }

    // Create valid product object matching API requirements
    const product = {
      productName: row.name,
      stockKeepingUnit: row.sku,
      productDescription: row.description || "",
      category: row.category || "",
      productSellingPrice,
      productCostPrice,
      reorderLevel,
      supplier: row.supplierName || "",
      supplierNumber: row.supplierNumber || "",
      locationStock,
    };

    validProducts.push(product);
  });

  return { validProducts, invalidRows };
};

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const generateSampleCSV = () => {
  // First sample - with multiple locations
  const multiLocationHeaders = [
    "name",
    "sku",
    "description",
    "category",
    "sellingPrice",
    "costPrice",
    "reorderLevel",
    "supplierName",
    "supplierNumber",
    "Main Storage",
    "Secondary Storage",
  ];

  const multiLocationRows = [
    [
      "Sample Product 1",
      "SP-001",
      "This is a sample product",
      "Electronics",
      "150.00",
      "100.00",
      "10",
      "Sample Supplier",
      "+1234567890",
      "20",
      "5",
    ],
  ];

  // Second sample - with a single quantity
  const singleLocationHeaders = [
    "name",
    "sku",
    "description",
    "category",
    "sellingPrice",
    "costPrice",
    "reorderLevel",
    "supplierName",
    "supplierNumber",
    "quantity",
  ];

  const singleLocationRows = [
    [
      "Sample Product 2",
      "SP-002",
      "Another sample product",
      "Home Decor",
      "85.00",
      "50.00",
      "15",
      "Another Supplier",
      "+0987654321",
      "18",
    ],
  ];

  // Create full sample with both types
  const csvContent =
    "# Sample CSV with multiple storage locations\n" +
    multiLocationHeaders.join(",") +
    "\n" +
    multiLocationRows.map((row) => row.join(",")).join("\n") +
    "\n\n# Sample CSV with single quantity\n" +
    singleLocationHeaders.join(",") +
    "\n" +
    singleLocationRows.map((row) => row.join(",")).join("\n") +
    "\n\n# Note: You can use either format. For multiple locations, add columns with your location names.";

  return csvContent;
};

export { parseCSV, validateAndTransformProducts, generateSampleCSV };