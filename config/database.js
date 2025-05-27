import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(`Error in Database ${error}`);
  }
};
