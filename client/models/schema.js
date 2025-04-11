import mongoose, { Schema, models } from 'mongoose';
import { generateSKU } from '@/utils/generateSKU';

// User Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    image: { type: String, default: '/profile.jpg' },
    whatsappNumber: { type: String },
    role: { type: String, enum: ['super-admin', 'admin', 'owner', 'manager', 'cashier'], default: 'owner' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    businesses: [{ type: Schema.Types.ObjectId, ref: 'Business' }], // Businesses user belongs to
    currentBusiness: { type: Schema.Types.ObjectId, ref: 'Business' }, // Currently active business
    assignedLocation: { type: Schema.Types.ObjectId, ref: 'Location' }, // For cashiers/managers
    accessibleLocations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    onboarded: { type: Boolean, default: false },
    permissions: {
      // Granular permissions
      canManageInventory: { type: Boolean, default: false },
      canProcessSales: { type: Boolean, default: true },
      canViewReports: { type: Boolean, default: false },
      // Add more as needed
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);

const businessSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "City Pharmacy"
    type: { type: String, required: true, enum: ['pharmacy', 'supermarket', 'restaurant', 'other'] },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    logo: { type: String },
    contactEmail: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

const Business = models.Business || mongoose.model('Business', businessSchema);

// Location Schema
const locationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    contactNumber: { type: String },
    locationType: { type: String, enum: ['retail', 'warehouse', 'headquarters'] }
  },
  { timestamps: true }
);

const Location = models.Location || mongoose.model('Location', locationSchema);

// Product Schema
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true },
    description: { type: String },
    category: { type: String },
    reorderLevel: { type: Number, required: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    expiryDate: {
      type: Date,
      index: true // Add index for faster queries
    },
    isExpired: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (!this.sku) {
    this.sku = generateSKU(this.name);
  }
  next();
});

const Product = models.Product || mongoose.model('Product', productSchema);

// Product Batch Schema
const productBatchSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    batchNumber: { type: String, required: true },
    manufactureDate: { type: Date },
    expiryDate: { type: Date, required: true, index: true },
    quantity: { type: Number, required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'sold', 'returned'],
      default: 'active'
    }
  },
  { timestamps: true }
);

const ProductBatch = models.ProductBatch || mongoose.model('ProductBatch', productBatchSchema);

// Product Stock Schema
const productStockSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    quantity: { type: Number, required: true, default: 0 }, // Stock at this location
  },
  { timestamps: true }
);

const ProductStock = models.ProductStock || mongoose.model('ProductStock', productStockSchema);

// Alert Schema
const alertSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    alertType: {
      type: [String],
      enum: ['email', 'sms', 'whatsapp'],
      required: true
    },
    message: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const StockAlert = models.StockAlert || mongoose.model('StockAlert', alertSchema);

// Supplier Schema
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

const Supplier = models.Supplier || mongoose.model('Supplier', supplierSchema);

// Order Schema
const orderSchema = new Schema(
  {
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Stores the product price at the time of order
    currency: { type: String, default: 'USD' }, // Ensures correct currency info
    type: { type: String, enum: ['sale', 'restock'], required: true },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model('Order', orderSchema);

// Invoice Schema
const invoiceSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, match: /.+\@.+\..+/ },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

const Invoice = models.Invoice || mongoose.model('Invoice', invoiceSchema);

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

const UserSettings = models.UserSettings || mongoose.model("UserSettings", settingsSchema);

// Receipt Schema
const receiptSchema = new Schema(
  {
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['cash', 'bank transfer', 'card', 'mobile money'],
      required: true
    },
    transactionId: { type: String, unique: true, sparse: true },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

const Receipt = models.Receipt || mongoose.model('Receipt', receiptSchema);

// Product Price Schema
const productPriceSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sellingPrice: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    discount: { type: Number, default: 0 }, // Percentage discount (e.g., 10 for 10%)
    effectiveDate: { type: Date, default: Date.now },
    expiryDate: { type: Date }, // Optional, useful for promotional pricing
  },
  { timestamps: true }
);

const ProductPrice = models.ProductPrice || mongoose.model('ProductPrice', productPriceSchema);

// Transaction Schema
const transactionSchema = new Schema(
  {
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    totalAmount: { type: Number, required: true },
    amountReceived: { type: Number },
    changeGiven: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'transfer', 'card', 'mobile money'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

const Transaction = models.Transaction || mongoose.model('Transaction', transactionSchema);

// Expiry Alert Schema
const expiryAlertSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    batch: { type: Schema.Types.ObjectId, ref: 'ProductBatch' },
    daysUntilExpiry: { type: Number, required: true },
    alertType: {
      type: String,
      enum: ['expired', 'near_expiry'],
      required: true
    },
    notified: { type: Boolean, default: false },
    notificationDate: { type: Date },
  },
  { timestamps: true }
);

const ExpiryAlert = models.ExpiryAlert || mongoose.model('ExpiryAlert', expiryAlertSchema);


export {
  User,
  Business,
  locationSchema,
  UserSettings,
  Supplier,
  Invoice,
  Order,
  StockAlert,
  Product,
  Receipt,
  ProductPrice,
  Transaction,
  Location,
  ProductStock,
  ProductBatch,
  ExpiryAlert
};
