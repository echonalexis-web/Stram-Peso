const User = require("../models/User");
const JobVacancy = require("../models/JobVacancy");
const JobApplication = require("../models/JobApplication");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalJobs = await JobVacancy.countDocuments();
    const totalApplications = await JobApplication.countDocuments();

    res.json({
      totalUsers,
      totalEmployees,
      totalResidents,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
