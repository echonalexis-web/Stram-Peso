import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../services/api";
import "../styles/profile.css";

export default function EditProfile() {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    about: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    desiredJobTitle: "",
    workExperience: "",
    educationalAttainment: "",
    availabilityStatus: "",
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [supportingDocumentFile, setSupportingDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        about: user.about || "",
        phone: user.phone || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
        gender: user.gender || "",
        desiredJobTitle: user.desiredJobTitle || "",
        workExperience: user.workExperience || "",
        educationalAttainment: user.educationalAttainment || "",
        availabilityStatus: user.availabilityStatus || "",
      });
      setSkills(Array.isArray(user.skills) ? user.skills : []);
    }
  }, [user]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleAddSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("about", formData.about);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("dateOfBirth", formData.dateOfBirth);
      data.append("gender", formData.gender);
      data.append("desiredJobTitle", formData.desiredJobTitle);
      data.append("workExperience", formData.workExperience);
      data.append("educationalAttainment", formData.educationalAttainment);
      data.append("availabilityStatus", formData.availabilityStatus);
      data.append("skills", JSON.stringify(skills));

      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      if (supportingDocumentFile) {
        data.append("supportingDocument", supportingDocumentFile);
      }

      const { data: response } = await authAPI.updateProfile(data);
      setMessage(response.message);
      login(localStorage.getItem("token"), response.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-overlay"></div>

      <form className="profile-form-card" onSubmit={handleSubmit}>
        <div className="profile-avatar-wrap">
          <label htmlFor="profileUpload" className="profile-avatar-circle" title="Upload Resume / Photo">
            {formData.name ? formData.name.trim().charAt(0).toUpperCase() : "U"}
          </label>
        </div>

        <h2 className="profile-title">Edit Profile</h2>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="profile-fields">
          <div className="profile-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="profile-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="profile-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="profile-field">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="profile-field profile-field-grid">
            <div>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input id="dateOfBirth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="about">About You</label>
            <textarea id="about" name="about" value={formData.about} onChange={handleChange} rows="4" />
          </div>

          <div className="profile-section-divider">Job Seeker Details</div>

          <div className="profile-field">
            <label htmlFor="desiredJobTitle">Desired Job Title</label>
            <input id="desiredJobTitle" type="text" name="desiredJobTitle" value={formData.desiredJobTitle} onChange={handleChange} />
          </div>

          <div className="profile-field">
            <label htmlFor="skills">Skills</label>
            <div className="skills-input-row">
              <input
                id="skills"
                type="text"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Add a skill and press Enter"
              />
              <button type="button" className="skill-add-btn" onClick={handleAddSkill}>Add</button>
            </div>
            <div className="skills-tags-wrap">
              {skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="workExperience">Work Experience</label>
            <input id="workExperience" type="text" name="workExperience" value={formData.workExperience} onChange={handleChange} />
          </div>

          <div className="profile-field">
            <label htmlFor="educationalAttainment">Educational Attainment</label>
            <input
              id="educationalAttainment"
              type="text"
              name="educationalAttainment"
              value={formData.educationalAttainment}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="availabilityStatus">Availability Status</label>
            <select
              id="availabilityStatus"
              name="availabilityStatus"
              value={formData.availabilityStatus}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="Available">Available</option>
              <option value="Employed">Employed</option>
              <option value="Part-time">Part-time</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="profile-section-divider">Documents</div>

          <div className="profile-field">
            <label htmlFor="profileUpload">Resume / Photo</label>
            <input
              id="profileUpload"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(event) => setResumeFile(event.target.files[0])}
              className="profile-file-input"
            />
            <label htmlFor="profileUpload" className="profile-upload-zone">
              <span className="upload-icon" aria-hidden="true">↑</span>
              <span>Upload Resume / Photo</span>
            </label>
            <p className="profile-file-name">{resumeFile ? resumeFile.name : "No file selected"}</p>
          </div>

          <div className="profile-field">
            <label htmlFor="supportingUpload">Valid ID / Supporting Documents</label>
            <input
              id="supportingUpload"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(event) => setSupportingDocumentFile(event.target.files[0])}
              className="profile-file-input"
            />
            <label htmlFor="supportingUpload" className="profile-upload-zone">
              <span className="upload-icon" aria-hidden="true">↑</span>
              <span>Upload Supporting Document</span>
            </label>
            <p className="profile-file-name">{supportingDocumentFile ? supportingDocumentFile.name : "No file selected"}</p>
          </div>
        </div>

        <button type="submit" disabled={loading} className="profile-save-btn">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
