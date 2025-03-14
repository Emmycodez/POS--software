import mongoose, { Schema, model } from "mongoose";
import { generateSKU } from "../utils/generateSku.js";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    whatsappNumber: { type: String },
    role: { type: String, enum: ["admin", "staff", "user"], default: "user" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastLogin: { type: Date },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const User = model("User", userSchema);

// TODO: Add location data to schema and form

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    description: { type: String },
    category: { type: String },
    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = generateSKU(this.name);
  }
  next();
});

const Product = model("Product", productSchema);

const alertSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    alertType: {
      type: [String],
      enum: ["email", "sms", "whatsapp"],
      required: true,
    },
    message: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const StockAlert = model("StockAlert", alertSchema);

const supplierSchema = new Schema(
  {
    name: { type: String, required: true },
    contactEmail: { type: String },
    phone: { type: String },
    countryCode: { type: String },
    address: { type: String },
    website: { type: String },
  },
  { timestamps: true }
);

const Supplier = model("Supplier", supplierSchema);

const orderSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Stores the product price at the time of order
    currency: { type: String, default: "USD" }, // Ensures correct currency info
    type: { type: String, enum: ["sale", "restock"], required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

const invoiceSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, match: /.+\@.+\..+/ },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const Invoice = model("Invoice", invoiceSchema);

const settingsSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    preferredNotifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
    },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "UTC" },
  },
  { timestamps: true }
);

const UserSettings = model("UserSettings", settingsSchema);

const receiptSchema = new Schema(
  {
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank transfer", "card", "mobile money"],
      required: true,
    },
    transactionId: { type: String, unique: true, sparse: true },
    receivedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { timestamps: true }
);

const Receipt = model("Receipt", receiptSchema);

const productPriceSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    discount: { type: Number, default: 0 }, // Percentage discount (e.g., 10 for 10%)
    effectiveDate: { type: Date, default: Date.now },
    expiryDate: { type: Date }, // Optional, useful for promotional pricing
  },
  { timestamps: true }
);

const ProductPrice = model("ProductPrice", productPriceSchema);

const transactionSchema = new Schema(
  {
    // cashier: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Who processed the transaction
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Product sold
        quantity: { type: Number, required: true }, // Quantity sold
        price: { type: Number, required: true }, // Price per unit at the time of sale
      },
    ],
    totalAmount: { type: Number, required: true }, // Total cost of all items
    amountReceived: { type: Number }, // Amount the customer paid
    changeGiven: { type: Number, default: 0 }, // Change given to the customer
    paymentMethod: {
      type: String,
      enum: ["cash", "bank transfer", "card", "mobile money"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    }, // Transaction state
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

export {
  User,
  UserSettings,
  Supplier,
  Invoice,
  Order,
  StockAlert,
  Product,
  Receipt,
  ProductPrice,
  Transaction,
};

// TODO: Add bank details section to user schema, bank name and account number, also enable multiple accounts to show during bank transfer POS event

// TODO: Add authentication and authorization for multi-party such as employess like cashiers e.t.c
