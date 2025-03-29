import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connectDB.js";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import productRoute from "./routes/productRoute.js";
import inventoryRoute from './routes/inventoryRoute.js'
import posRoute from './routes/posRoute.js'
import transactionRoute from './routes/transactionRoute.js'
import alertRoute from './routes/alertRoute.js'
import supplierRoute from './routes/supplierRoute.js'

dotenv.config();

const dbUrl = process.env.DB_URL;

connectDB(dbUrl);
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// Routes

app.use("/api/products", productRoute);
app.use('/api/inventory', inventoryRoute);
app.use("/api/pos", posRoute)
app.use("/api/transactions", transactionRoute);
app.use("/api/alerts", alertRoute);
app.use("/api/suppliers", supplierRoute)

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
