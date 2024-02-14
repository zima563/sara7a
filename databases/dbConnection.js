import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/sara7a").then(() => {
    console.log("database connection");
  });
};
