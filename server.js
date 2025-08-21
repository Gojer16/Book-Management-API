const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
let DB_URI;

switch (process.env.NODE_ENV) {
  case "production":
    DB_URI = process.env.DB_URI_PROD; 
    break;
  case "test":
    DB_URI = process.env.DB_URI_TEST || "mongodb://127.0.0.1:27017/book_api_test";
    break;
  default:
    DB_URI = process.env.DB_URI_DEV || "mongodb://127.0.0.1:27017/book_api";
    break;
}

mongoose.connect(DB_URI)
  .then(() => {
    console.log(`Connected to MongoDB ✅ (${process.env.NODE_ENV})`);
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  });
