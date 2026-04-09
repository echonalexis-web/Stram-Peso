import { useEffect, useState } from "react";
import { jobAPI } from "../services/api";
import "../styles/dashboard.css";

export default function EmployeeDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicationsByJob, setApplicationsByJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await jobAPI.getEmployerJobs();
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const { data } = await jobAPI.getApplicationsForJob(jobId);
      setSelectedJob(jobId);
      setApplicationsByJob((prev) => ({ ...prev, [jobId]: data }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applicants");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="profile-section">
          <div className="profile-avatar">EM</div>
          <div className="profile-info">
            <h1>👔 Employer Dashboard</h1>
            <p>Manage job postings and review applicants.</p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p className="loading">Loading your job postings...</p>
      ) : (
        <div className="reports-section">
          <h2>Your Job Postings</h2>
          {jobs.length === 0 ? (
            <p>You have not posted any vacancies yet.</p>
          ) : (
            <div className="reports-list">
              {jobs.map((job) => (
                <div key={job._id} className="report-card">
                  <div className="report-header">
                    <h3>{job.title}</h3>
                    <span className="status-badge status-available">Active</span>
                  </div>
                  <p className="report-location">📍 {job.location}</p>
                  <p className="report-description">{job.description.slice(0, 120)}...</p>
                  <p className="report-footer">Salary: {job.salary || "Negotiable"}</p>
                  <button className="btn-view" onClick={() => fetchApplications(job._id)}>
                    View Applicants
                  </button>

                  {selectedJob === job._id && (
                    <div className="application-list">
                      <h4>Applicants</h4>
                      {applicationsByJob[job._id] === undefined ? (
                        <p>Loading applicants...</p>
                      ) : applicationsByJob[job._id].length === 0 ? (
                        <p>No applications yet.</p>
                      ) : (
                        applicationsByJob[job._id].map((application) => (
                          <div key={application._id} className="report-card">
                            <h4>{application.applicant?.name}</h4>
                            <p>{application.applicant?.email}</p>
                            <p>Status: {application.status}</p>
                            <p>{application.coverLetter || "No cover letter submitted."}</p>
                            {application.resume && (
                              <a
                                className="btn-view"
                                href={`/${application.resume.replace(/^\//, "")}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                View Resume
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
