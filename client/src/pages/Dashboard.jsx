import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jobAPI } from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobRes, applicationRes] = await Promise.all([
        jobAPI.getJobs(),
        jobAPI.getMyApplications(),
      ]);
      setJobs(jobRes.data);
      setApplications(applicationRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard content");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(" ").map((part) => part[0]).join("").toUpperCase().slice(0, 2);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="profile-section">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h1>👋 Welcome, {user.name}!</h1>
            <p className="profile-email">✉️ {user.email}</p>
            <span className="profile-role">🧑‍💼 Job Seeker</span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{jobs.length}</span>
            <span className="stat-label">Available Jobs</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number stat-pending">{applications.length}</span>
            <span className="stat-label">Your Applications</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="action-section">
          <button className="btn-primary-large" onClick={() => navigate("/jobs") }>
            🔎 Browse Jobs
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading">Loading dashboard...</p>
        ) : (
          <>
            <div className="reports-section">
              <h2>Latest Jobs</h2>
              {jobs.length === 0 ? (
                <p>No jobs are available right now.</p>
              ) : (
                <div className="reports-list">
                  {jobs.slice(0, 4).map((job) => (
                    <div key={job._id} className="report-card">
                      <div className="report-header">
                        <h3>{job.title}</h3>
                        <span className="status-badge status-available">Open</span>
                      </div>
                      <p className="report-location">📍 {job.location}</p>
                      <p className="report-description">{job.description.slice(0, 120)}...</p>
                      <button className="btn-view" onClick={() => navigate(`/jobs/${job._id}`)}>
                        View Job
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="reports-section">
              <h2>Your Applications</h2>
              {applications.length === 0 ? (
                <p>You haven't applied to any jobs yet.</p>
              ) : (
                <div className="reports-list">
                  {applications.map((application) => (
                    <div key={application._id} className="report-card">
                      <div className="report-header">
                        <h3>{application.vacancy?.title}</h3>
                        <span className="status-badge status-pending">{application.status}</span>
                      </div>
                      <p className="report-location">📍 {application.vacancy?.location}</p>
                      <p className="report-footer">Employer: {application.vacancy?.employer?.name || "Unknown"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
