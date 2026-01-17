const mongoose = require("mongoose");
const DB_URL = process.env.DATABASE_LOCAL;
console.log(DB_URL);

const connectDatabase = () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.log("MongoDB connection failed");
    });
};

module.exports = connectDatabase;
