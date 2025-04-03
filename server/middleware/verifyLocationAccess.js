// middleware/locationAuth.js
const verifyLocationAccess = (req, res, next) => {
  const { locationId } = req.query;
  if (req.user.role === 'cashier' && !req.user.assignedLocation.equals(locationId)) {
    return res.status(403).json({ error: 'Unauthorized location access' });
  }
  next();
};