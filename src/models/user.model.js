const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  telegram_id: { type: Number },
  username: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);