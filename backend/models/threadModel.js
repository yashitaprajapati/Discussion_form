const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  category: { type: String },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Thread", threadSchema);
