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

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append("coverLetter", coverLetter);
      await jobAPI.applyToJob(id, formData);
      alert("Application submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to apply to job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="report-container"><p>Loading job details...</p></div>;

  if (error) return <div className="report-container"><div className="error-message">{error}</div></div>;

  if (!job) return <div className="report-container"><p>Job not found.</p></div>;

  return (
    <div className="report-container">
      <div className="report-box">
        <h2>{job.title}</h2>
        <p className="subtitle">{job.location} • {job.salary || "Salary negotiable"}</p>
        <p>{job.description}</p>
        <div className="info-box">
          <p><strong>Employer:</strong> {job.employer?.name}</p>
          <p><strong>About Employer:</strong> {job.employer?.about || "Not provided"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="5"
              placeholder="Tell the employer why you're a good fit"
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="form-control"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Applying..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
