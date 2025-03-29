"use server";

import { revalidatePath } from "next/cache";

export const createProduct = async ({
  productName,
  productSellingPrice,
  productCostPrice,
  locationStock,
  productDescription,
  supplier,
  supplierNumber,
  reorderLevel,
  category,
  stockKeepingUnit,
}) => {
  try {
    if (
      !productName ||
      !productSellingPrice || !productCostPrice ||
      !locationStock | !productDescription ||
      !supplier ||
      !supplierNumber ||
      !reorderLevel ||
      !category ||
      !stockKeepingUnit
    ) {
      console.log("Incomplete product creation details");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          productSellingPrice,
          productCostPrice,
          stock: locationStock,
          productDescription,
          supplier,
          supplierNumber,
          reorderLevel,
          category,
          stockKeepingUnit,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to create Product in database: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("This is the data returned from the backend", data);
    return data;
  } catch (error) {
    console.error("Error creating new product: ", error.message);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching products from the server action",
      error.message
    );
    throw error;
  }
};

export const getSuppliers = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/suppliers`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching suppliers from the server action",
      error.message
    );
    throw error;
  }
};

export const getInventory = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching inventory from the server action",
      error.message
    );
    throw error;
  }
};

export const getPosProducts = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pos`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching pos products from the server action",
      error.message
    );
    throw error;
  }
};

export const createSupplier = async (values) => {
  try {
    if (values) {
      console.log("The values sent from the create supplier form: ", values);
    }

    const { name, contactEmail, phone, countryCode, address, website } = values;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/suppliers
    `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          contactEmail,
          phone,
          countryCode,
          address,
          website,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to create supplier in database: ${response.statusText}`
      );
      throw new Error(
        `Failed to create supplier in database: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("This is the data returned from the backend", data);
    revalidatePath("/site/dashboard/suppliers");
    return data;
  } catch (error) {
    console.error(
      "Error creating supplier in the server action",
      error.message
    );
    throw error;
  }
};

export const createTransaction = async (data) => {
  revalidatePath("/site/dashboard/pos");
  if (data) {
    console.log("The create transaction function is being called", data);
  }

  const { products, paymentMethod, amountReceived, changeGiven, total } = data;
  try {
    // if (
    //   !products ||
    //   !paymentMethod ||
    //   !amountReceived ||
    //   !changeGiven ||
    //   !total
    // ) {
    //   console.log(
    //     "Pls send all correct data to the server action: products,total,amountReceived,changeGiven"
    //   );
    //   return;
    // }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions
      `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          paymentMethod,
          amountReceived,
          changeGiven,
          total,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to create transaction in database: ${response.statusText}`
      );
      throw new Error(
        `Failed to create transaction in database: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("This is the data returned from the backend", data);
    revalidatePath("/site/dashboard/transactions");
    return data;
  } catch (error) {
    console.error(
      "Error creating transaction in the server action",
      error.message
    );
    throw error;
  }
};

export const updateInventory = async (id, newQuantity) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/inventory
      `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          newQuantity,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to update inventory quantity in the database: ${response.statusText}`
      );
      throw new Error(
        `Failed to update inventory quantity in the database: ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("This is the data returned from the backend", data);
    return data;
  } catch (error) {
    console.error(
      "Error creating updating inventory stock quantity",
      error.message
    );
    throw error;
  }
};
export const updateAlert = async (status, alertId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/alerts
      `,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          alertId,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to update alert status in the database: ${response.statusText}`
      );
      throw new Error(
        `Failed to update alert status in the database: ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("This is the data returned from the backend", data);
    return data;
  } catch (error) {
    console.error("Error updating alert status", error.message);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching transactions from server action",
      error.message
    );
    throw error;
  }
};

export const getAlerts = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/alerts`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error fetching alerts from the server action",
      error.message
    );
    throw error;
  }
};
