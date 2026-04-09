const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["resident", "employer", "admin"],
    default: "resident",
  },
  about: { type: String, default: "" },
  resume: { type: String, default: "" },
  supportingDocument: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, default: "" },
  desiredJobTitle: { type: String, default: "" },
  skills: { type: [String], default: [] },
  workExperience: { type: String, default: "" },
  educationalAttainment: { type: String, default: "" },
  availabilityStatus: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
