import React from "react";
import "../styles/modal.css";

export default function Modal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null;

  return (
    <div
      className="job-preview-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="job-preview-card" role="dialog" aria-modal="true" aria-label="Job details">
        <button className="job-preview-close" onClick={onClose} type="button" aria-label="Close">
          x
        </button>

        <div className="job-preview-hero">
          <h2>{job.title}</h2>
          <span className="job-preview-status">Open</span>
        </div>

        <div className="job-preview-meta">
          <span className="job-preview-chip">Location: {job.location || "Not specified"}</span>
          <span className="job-preview-chip">Salary: {job.salary || "Salary negotiable"}</span>
        </div>

        <div className="job-preview-section">
          <h3>About this job</h3>
          <p>{job.description || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
}