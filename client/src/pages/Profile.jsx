import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fallback = (value) => {
    if (!value) return <span className="profile-missing">Not provided</span>;
    return value;
  };

  const skills = Array.isArray(user?.skills) ? user.skills : [];

  const resumeName = user?.resume ? user.resume.split("/").pop() : null;
  const supportingName = user?.supportingDocument
    ? user.supportingDocument.split("/").pop()
    : null;

  const formatDate = (value) => {
    if (!value) return <span className="profile-missing">Not provided</span>;
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div className="profile-view-page">
      <div className="profile-overlay"></div>

      <section className="profile-view-card">
        <header className="profile-view-header">
          <button className="profile-edit-btn" type="button" onClick={() => navigate("/profile/edit")}>
            Edit Profile
          </button>
          <div className="profile-view-avatar">
            {user.name ? user.name.trim().charAt(0).toUpperCase() : "U"}
          </div>
          <h1>{user.name}</h1>
          <p>{user.about || <span className="profile-missing">Not provided</span>}</p>
        </header>

        <div className="profile-view-section">
          <h2>Personal Details</h2>
          <div className="profile-detail-row"><span>Full Name</span><strong>{fallback(user.name)}</strong></div>
          <div className="profile-detail-row"><span>Email Address</span><strong>{fallback(user.email)}</strong></div>
          <div className="profile-detail-row"><span>Phone Number</span><strong>{fallback(user.phone)}</strong></div>
          <div className="profile-detail-row"><span>Address / Location</span><strong>{fallback(user.address)}</strong></div>
          <div className="profile-detail-row"><span>Date of Birth</span><strong>{formatDate(user.dateOfBirth)}</strong></div>
          <div className="profile-detail-row"><span>Gender</span><strong>{fallback(user.gender)}</strong></div>
        </div>

        <div className="profile-view-section">
          <h2>Job Seeker Details</h2>
          <div className="profile-detail-row"><span>Desired Job Title / Position</span><strong>{fallback(user.desiredJobTitle)}</strong></div>
          <div className="profile-detail-row profile-detail-row--skills">
            <span>Skills</span>
            <div className="profile-skills-list">
              {skills.length > 0 ? (
                skills.map((skill) => <span key={skill} className="profile-skill-tag">{skill}</span>)
              ) : (
                <span className="profile-missing">Not provided</span>
              )}
            </div>
          </div>
          <div className="profile-detail-row"><span>Work Experience</span><strong>{fallback(user.workExperience)}</strong></div>
          <div className="profile-detail-row"><span>Highest Educational Attainment</span><strong>{fallback(user.educationalAttainment)}</strong></div>
          <div className="profile-detail-row">
            <span>Availability Status</span>
            <strong>
              {user.availabilityStatus ? (
                <span className="profile-availability-badge">{user.availabilityStatus}</span>
              ) : (
                <span className="profile-missing">Not provided</span>
              )}
            </strong>
          </div>
        </div>

        <div className="profile-view-section">
          <h2>Documents / Attachments</h2>
          <div className="profile-detail-row profile-detail-row--document">
            <span>Resume</span>
            <strong>
              {resumeName ? resumeName : <span className="profile-missing">No resume uploaded</span>}
              <button type="button" className="profile-doc-upload-btn" onClick={() => navigate("/profile/edit")}>Upload</button>
            </strong>
          </div>
          <div className="profile-detail-row profile-detail-row--document">
            <span>Valid ID / Supporting Documents</span>
            <strong>{supportingName || <span className="profile-missing">Not provided</span>}</strong>
          </div>
        </div>

      </section>
    </div>
  );
}
