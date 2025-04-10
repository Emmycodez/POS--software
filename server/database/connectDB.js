import mongoose from "mongoose";


const connectDB = async (dbUrl) => {
  try {
    await mongoose.connect(dbUrl),
      {
        dbName: "inventorySaas",
      };
    console.log("Database connected....");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
