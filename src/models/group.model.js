const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  department: { type: String, required: true },
  group_id: { type: Number, required: true },
  group_name: String,
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);