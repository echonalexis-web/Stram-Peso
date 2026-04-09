import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobAPI } from "../services/api";
import "../styles/dashboard.css";

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await jobAPI.getJobs();
        setJobs(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="profile-section">
          <div>
            <h1>Available Jobs in Marinduque</h1>
            <p>Browse open vacancies and apply with your resume.</p>
          </div>
        </div>
      </div>

      <div className="reports-section">
        {loading ? (
          <p className="loading">Loading jobs...</p>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="no-reports">
            <p>No job vacancies are available right now.</p>
          </div>
        ) : (
          <div className="reports-list">
            {jobs.map((job) => (
              <div key={job._id} className="report-card">
                <div className="report-header">
                  <h3>{job.title}</h3>
                  <span className="status-badge status-available">Open</span>
                </div>
                <p className="report-location">📍 {job.location}</p>
                <p className="report-description">{job.description}</p>
                <p className="report-footer">Salary: {job.salary || "Negotiable"}</p>
                <p className="report-footer">Employer: {job.employer?.name || "Unknown"}</p>
                <Link to={`/jobs/${job._id}`} className="btn-view">
                  View & Apply
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
