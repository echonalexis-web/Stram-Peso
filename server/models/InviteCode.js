const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  usedAt: { type: Date, default: null },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("InviteCode", inviteCodeSchema);