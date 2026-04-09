const JobVacancy = require("../models/JobVacancy");
const JobApplication = require("../models/JobApplication");
const User = require("../models/User");

exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" });
    }

    const job = await JobVacancy.create({
      title,
      description,
      location,
      salary,
      employer: req.user.id,
    });

    res.json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobVacancy.find({ isActive: true })
      .populate("employer", "name email role about")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await JobVacancy.findById(req.params.id).populate("employer", "name email role about");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await JobVacancy.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only update your own job postings" });
    }

    const updates = {
      title: req.body.title || job.title,
      description: req.body.description || job.description,
      location: req.body.location || job.location,
      salary: req.body.salary || job.salary,
      isActive: typeof req.body.isActive === "boolean" ? req.body.isActive : job.isActive,
    };

    const updatedJob = await JobVacancy.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await JobVacancy.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You can only delete your own job postings" });
    }

    await JobVacancy.findByIdAndDelete(req.params.id);
    res.json({ message: "Job posting removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const job = await JobVacancy.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApplication = await JobApplication.findOne({
      applicant: req.user.id,
      vacancy: job._id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    const application = await JobApplication.create({
      applicant: req.user.id,
      vacancy: job._id,
      resume: req.file ? `uploads/${req.file.filename}` : undefined,
      coverLetter: req.body.coverLetter || "",
    });

    res.json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await JobVacancy.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await JobApplication.find({ vacancy: job._id })
      .populate("applicant", "name email about")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicant: req.user.id })
      .populate("vacancy", "title location employer")
      .populate("vacancy.employer", "name email")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMyApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own applications" });
    }

    if (typeof req.body.coverLetter === "string") {
      application.coverLetter = req.body.coverLetter;
    }

    if (req.file) {
      application.resume = `uploads/${req.file.filename}`;
    }

    await application.save();

    const populated = await JobApplication.findById(application._id)
      .populate("vacancy", "title location employer")
      .populate("vacancy.employer", "name email");

    res.json({ message: "Application updated successfully", application: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMyApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own applications" });
    }

    await JobApplication.findByIdAndDelete(application._id);
    res.json({ message: "Application withdrawn successfully", id: application._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await JobVacancy.find({ employer: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
