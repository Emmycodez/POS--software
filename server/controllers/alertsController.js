import { StockAlert } from "../database/schema.js";

export const getAlerts = async (req, res) => {
  try {
    const alerts = await StockAlert.find().populate("product"); // Populate product data

    const formattedAlerts = alerts.map((alert) => ({
      id: alert._id.toString(),
      createdAt: alert.createdAt,
      type: alert.alertType,
      productName: alert.product?.name || "Unknown Product",
      message: alert.message,
      read: alert.status || false, // Assuming status represents read/unread
      productId: alert.product?._id.toString() || null,
      sku: alert.product?.sku || "N/A",
    }));

    res.status(200).json(formattedAlerts);
  } catch (error) {
    console.error("Failed to fetch alerts:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAlerts = async (req, res) => {
  try {
    const { status, alertId } = req.body;

    // Validate request data
    if (!alertId || !status) {
      return res.status(400).json({
        message: "Send all required fields: status and alertId",
      });
    }

    const alert = await StockAlert.findById(alertId);

    if (!alert) {
      return res
        .status(404)
        .json({ message: "Invalid alert id, alert not found" });
    }

    alert.status = status;

    await alert.save();

    return res.status(200).json({
      message: "alert status updated successfully",
      alert,
    });
  } catch (error) {
    console.error("Failed to update alert status:", error.message);

    return res.status(500).json({ message: "Internal server error" });
  }
};
