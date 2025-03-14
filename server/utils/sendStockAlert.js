import { sendEmail } from "./emailservice.js";
import { createMessage } from "./send_sms.js";
import { sendSMS } from "./sendSMS.js";

export const sendStockAlert = async (product) => {
  const body = `⚠️ Stock Alert: ${product.name} is running low! Only ${product.quantity} left. It's SKU is ${product.sku}. It's description is ${product.description}`;
  const number = "+2347048268704";
  createMessage(number, body);
  sendEmail("oamenemmanuel73@gmail.com", "⚠️Low Stock Alert!!!", body);

  // Logic to send alerts via WhatsApp, email, or SMS
  // Example: Send an email using a notification service
};

// TODO: Enable sms, email and whatsapp notification functionalities

// This is the product data sent to this function:  {
//   _id: new ObjectId('67c984f5793c99d9c21fafd8'),
//   name: 'Handkerchief',
//   sku: 'FAS-HAN-7089',
//   description: 'White handkerchief',
//   category: 'Fashion',
//   quantity: 3,
//   reorderLevel: 10,
//   supplier: new ObjectId('67c984f5793c99d9c21fafd6'),
//   createdAt: 2025-03-06T11:20:21.511Z,
//   updatedAt: 2025-03-10T13:17:34.979Z,
//   __v: 0
// }

// const sendStockAlert = async (product) => {
//   try {
//     console.log(`⚠️ Stock Alert: ${product.name} is running low!`);

//     // Get the admin/user who should receive the alert (you can customize this)
//     const adminUser = await User.findOne({ role: "admin" }); // Assuming you have user roles

//     if (!adminUser) {
//       console.error("No admin found to receive stock alerts.");
//       return;
//     }

//     // Create a stock alert entry in the database
//     const newAlert = new StockAlert({
//       product: product._id,
//       user: adminUser._id, // Assign the admin to receive the alert
//       alertType: "email", // Default alert type (you can change this dynamically)
//       message: `Stock for ${product.name} is low. Remaining quantity: ${product.quantity}`,
//       status: "pending",
//     });

//     await newAlert.save();
//     console.log(`📩 Stock alert created for ${product.name}`);

//     // TODO: Integrate email/SMS/WhatsApp notification system here

//   } catch (error) {
//     console.error("Failed to send stock alert:", error.message);
//   }
// };
