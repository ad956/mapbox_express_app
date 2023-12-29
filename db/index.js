if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");

console.log("Connecting to db ...");

const DB_URI = "mongodb://127.0.0.1:27017/img_upload";
// const DB_URI = process.env.DB_URL || "mongodb://127.0.0.1:27017/img_upload";

mongoose
  .connect(DB_URI)
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((e) => console.log("ERROR WHILE CONNECTING DATABASE : " + e));
