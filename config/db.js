const mongoose = require("mongoose");
const DB_URL = process.env.DATABASE_LOCAL;

const connectDatabase = () => {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
};

module.exports = connectDatabase;
