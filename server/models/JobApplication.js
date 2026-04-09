const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vacancy: { type: mongoose.Schema.Types.ObjectId, ref: "JobVacancy", required: true },
  resume: { type: String, required: false },
  coverLetter: { type: String, default: "", required: false },
  status: {
    type: String,
    enum: ["Applied", "Reviewed", "Accepted", "Rejected"],
    default: "Applied"
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
