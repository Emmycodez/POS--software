import { Product, StockAlert, Transaction } from "../database/schema.js";
import { sendStockAlert } from "../utils/sendStockAlert.js";

export const createTransaction = async (req, res) => {
  console.log("This is the request body being sent to the backend: ", req.body);
  try {
    const { products, total, paymentMethod, amountReceived, changeGiven } =
      req.body;

    if (!products || !paymentMethod || !total) {
      return res.status(400).json({
        message: "Send all required fields: products, total, paymentMethod",
      });
    }

    // **Step 1: Create the transaction**
    const newTransaction = new Transaction({
      products,
      totalAmount: total,
      amountReceived,
      changeGiven,
      paymentMethod,
    });

    await newTransaction.save();
    console.log("Transaction saved:", newTransaction);

    // **Step 2: Update Product Stock Levels**
    for (const item of products) {
      const product = await Product.findById(item.product); // Find the product in DB

      if (product) {
        if (product.quantity < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
          });
        }

        product.quantity -= item.quantity; // Reduce stock
        await product.save(); // Save changes in DB

        // **Step 3: Check if stock is low and send alert**
        if (product.quantity <= product.reorderLevel) {
          await sendStockAlert(product); // Send alert function

          const newAlert = new StockAlert({
            product: product._id,
            alertType: "email", // Change to "sms" or "whatsapp" if needed
            message: `Stock level for ${product.name} (SKU: ${product.sku}) is low. Current stock: ${product.quantity}, Reorder level: ${product.reorderLevel}.`,
            status: false, // Unread alert
          });

          await newAlert.save();
          console.log(`Stock alert created for ${product.name}`);
        }
      }
    }

    return res.status(201).json({
      message: "Transaction created successfully, stock updated",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Failed to create transaction:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// // **Check Stock Levels After Transaction**
// for (const item of products) {
//   const product = await Product.findById(item.id); // Find the product in DB

//   if (product) {
//     product.quantity -= item.quantity; // Reduce stock
//     await product.save(); // Update stock in DB

//     // **Check if stock is low and send an alert**
//     if (product.quantity <= product.reorderLevel) {
//       await sendStockAlert(product);
//     }
//   }
// }
