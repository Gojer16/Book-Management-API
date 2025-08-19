const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/book_api";

mongoose.connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB ✅");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  });
