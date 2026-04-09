import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jobAPI } from "../services/api";
import "../styles/report.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobAPI.getJobById(id);
        setJob(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append("coverLetter", coverLetter);
      await jobAPI.applyToJob(id, formData);
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="report-container"><p>Loading job details...</p></div>;

  if (error) return <div className="report-container"><div className="error-message">{error}</div></div>;

  if (!job) return <div className="report-container"><p>Job not found.</p></div>;

  return (
    <div className="job-detail-page">
      <section className="job-hero">
        <div className="job-hero-inner">
          <h1>{job.title}</h1>
          <div className="job-hero-meta">
            <span className="job-chip">{job.location}</span>
            <span className="job-chip">{job.salary || "Salary negotiable"}</span>
          </div>
        </div>
      </section>

      <div className="job-detail-layout">
        <main className="job-main-column">
          <section className="job-section">
            <h2>{job.title}</h2>
            <div className="job-info-chips">
              <span className="job-chip job-chip-outline">{job.location}</span>
              <span className="job-chip job-chip-outline">{job.salary || "Salary negotiable"}</span>
            </div>
          </section>

          <section className="job-section">
            <h3>About the Job</h3>
            <p className="job-description-text">{job.description}</p>
          </section>

          <section className="employer-card">
            <h3>Employer Info</h3>
            <p><strong>Employer Name:</strong> {job.employer?.name}</p>
            <p><strong>About Employer:</strong> {job.employer?.about || "Not provided"}</p>
          </section>
        </main>

        <aside className="job-apply-column">
          <div className="apply-card">
            <h3>Apply for this Position</h3>
            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="6"
                  placeholder="Tell the employer why you're a good fit"
                  className="form-control"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="resume">Upload Resume</label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="file-input"
                />
                <label htmlFor="resume" className="file-input-label">Choose File</label>
                <p className="file-name">{resumeFile ? resumeFile.name : "No file selected"}</p>
              </div>

              <button type="submit" disabled={submitting} className="btn-apply">
                {submitting ? "Applying..." : "Apply Now"}
              </button>

              {successMessage && <p className="feedback-success">{successMessage}</p>}
              {error && <p className="feedback-error">{error}</p>}
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
