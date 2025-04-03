
import {
  Product,
  ProductBatch,
  Transaction,
  Order,
  StockAlert,
  ExpiryAlert,
  ProductStock,
  ProductPrice
} from '../database/schema.js';

import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import mongoose from 'mongoose';


export const getSalesTrendData = async (locationId) => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // 1. Fetch all completed transactions in the last 30 days with product details
  const transactions = await Transaction.find({
    location: new mongoose.Types.ObjectId(locationId),
    status: "completed",
    createdAt: { $gte: thirtyDaysAgo }
  }).populate({
    path: "products.product",
    populate: {
      path: "prices",
      match: { expiryDate: { $gte: new Date() } },
      options: { sort: { effectiveDate: -1 }, limit: 1 }
    }
  }).lean();

  // 2. Initialize daily data structure
  const dailySalesData = [];

  // 3. Process each day in the 30-day period
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // Filter transactions for this specific day
    const dailyTransactions = transactions.filter(t => {
      const txDate = new Date(t.createdAt);
      return txDate >= dayStart && txDate <= dayEnd;
    });

    // Calculate daily metrics
    let dailyRevenue = 0;
    let dailyProfit = 0;

    dailyTransactions.forEach(transaction => {
      dailyRevenue += transaction.totalAmount;
      
      transaction.products.forEach(item => {
        if (item.product?.prices?.[0]) {
          const price = item.product.prices[0];
          const profitPerUnit = price.sellingPrice - price.costPrice;
          dailyProfit += profitPerUnit * item.quantity;
        }
      });
    });

    dailySalesData.push({
      date: format(date, "MMM dd"), // e.g. "Jul 15"
      revenue: dailyRevenue,
      profit: dailyProfit,
      transactions: dailyTransactions.length
    });
  }

  return {
    data: dailySalesData,
    timeRange: {
      start: thirtyDaysAgo,
      end: today
    }
  };
};

export const getInventoryInsights = async (locationId) => {
  try {
    
  } catch (error) {
    
  }
}

export const getDashboardData = async (req, res) => {
  try {
    const { locationId } = req.params;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const salesTrend = await getSalesTrendData(locationId);

    // 1. Fetch core metrics (all time and last 30 days)
    const [
      // All time metrics
      totalRevenueResult, 
      totalOrders, 
      totalTransactions, 
      transactionDetails,
      
      // Last 30 days metrics
      last30DaysRevenueResult,
      last30DaysOrders,
      last30DaysTransactions,
      last30DaysTransactionDetails,
      
      // Stock alerts (unchanged)
      outOfStock, 
      lowStock, 
      nearExpiry
    ] = await Promise.all([
      // All time metrics
      Transaction.aggregate([
        { 
          $match: { 
            location: new mongoose.Types.ObjectId(locationId),
            status: "completed" 
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: "$totalAmount" } 
          } 
        }
      ]),
      
      Order.countDocuments({ location: locationId }),
      Transaction.countDocuments({ location: locationId }),
      
      // All completed transactions with product details
      Transaction.find({
        location: locationId,
        status: "completed"
      }).populate({
        path: "products.product",
        populate: {
          path: "prices",
          match: { expiryDate: { $gte: new Date() } },
          options: { sort: { effectiveDate: -1 }, limit: 1 }
        }
      }),
      
      // Last 30 days revenue
      Transaction.aggregate([
        { 
          $match: { 
            location: new mongoose.Types.ObjectId(locationId),
            status: "completed",
            createdAt: { $gte: thirtyDaysAgo }
          } 
        },
        { 
          $group: { 
            _id: null, 
            total: { $sum: "$totalAmount" } 
          } 
        }
      ]),
      
      // Last 30 days orders
      Order.countDocuments({ 
        location: locationId,
        createdAt: { $gte: thirtyDaysAgo }
      }),
      
      // Last 30 days transactions
      Transaction.countDocuments({ 
        location: locationId,
        createdAt: { $gte: thirtyDaysAgo }
      }),
      
      // Last 30 days transaction details for profit calculation
      Transaction.find({
        location: locationId,
        status: "completed",
        createdAt: { $gte: thirtyDaysAgo }
      }).populate({
        path: "products.product",
        populate: {
          path: "prices",
          match: { expiryDate: { $gte: new Date() } },
          options: { sort: { effectiveDate: -1 }, limit: 1 }
        }
      }),
      
      // Stock alerts (unchanged)
      ProductStock.find({ 
        location: locationId, 
        quantity: 0 
      }).populate("product"),
      
      ProductStock.aggregate([
        { $match: { location: new mongoose.Types.ObjectId(locationId) } },
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" },
        { $match: { $expr: { $lte: ["$quantity", "$productDetails.reorderLevel"] } } }
      ]),
      
      ProductBatch.find({
        location: locationId,
        expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      }).populate("product")
    ]);

    // Calculate all time metrics
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    let totalProfit = 0;
    transactionDetails.forEach(transaction => {
      transaction.products.forEach(item => {
        const product = item.product;
        if (product.prices && product.prices.length > 0) {
          const latestPrice = product.prices[0];
          const profitPerUnit = latestPrice.sellingPrice - latestPrice.costPrice;
          totalProfit += profitPerUnit * item.quantity;
        }
      });
    });

    // Calculate last 30 days metrics
    const last30DaysRevenue = last30DaysRevenueResult[0]?.total || 0;
    let last30DaysProfit = 0;
    last30DaysTransactionDetails.forEach(transaction => {
      transaction.products.forEach(item => {
        const product = item.product;
        if (product.prices && product.prices.length > 0) {
          const latestPrice = product.prices[0];
          const profitPerUnit = latestPrice.sellingPrice - latestPrice.costPrice;
          last30DaysProfit += profitPerUnit * item.quantity;
        }
      });
    });

    res.json({
      allTime: {
        metrics: {
          totalRevenue,
          totalProfit,
          totalOrders,
          totalTransactions,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
        }
      },
      last30Days: {
        metrics: {
          totalRevenue: last30DaysRevenue,
          totalProfit: last30DaysProfit,
          totalOrders: last30DaysOrders,
          totalTransactions: last30DaysTransactions,
          averageOrderValue: last30DaysOrders > 0 ? last30DaysRevenue / last30DaysOrders : 0,
          profitMargin: last30DaysRevenue > 0 ? (last30DaysProfit / last30DaysRevenue) * 100 : 0,
          // Additional useful metrics for trend analysis
          dailyAverageRevenue: last30DaysRevenue / 30,
          dailyAverageTransactions: last30DaysTransactions / 30
        }
      },
     salesTrendData: {...salesTrend} ,
      stock: {
        outOfStock,
        lowStock,
        nearExpiry
      },
      // Additional useful data for the frontend
      timeRange: {
        last30DaysStart: thirtyDaysAgo,
        last30DaysEnd: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};