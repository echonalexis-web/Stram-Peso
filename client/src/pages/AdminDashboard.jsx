import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { adminAPI } from "../services/api";
import "../styles/admin.css";

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAnalytics();
    fetchUsers();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await adminAPI.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
  };

  const generateInvite = async () => {
    try {
      const { data } = await adminAPI.generateInvite();
      alert(`Invite Code: ${data.code}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate invite code");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Analytics</h1>
        <button className="btn-secondary" onClick={generateInvite}>
          Generate Employer Invite Code
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        analytics && (
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Accounts</h3>
              <p>{analytics.totalUsers}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Employers</h3>
              <p>{analytics.totalEmployees}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Job Seekers</h3>
              <p>{analytics.totalResidents}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Vacancies</h3>
              <p>{analytics.totalJobs}</p>
            </div>
            <div className="analytics-card">
              <h3>Total Applications</h3>
              <p>{analytics.totalApplications}</p>
            </div>
          </div>
        )
      )}

      <div className="users-section">
        <h2>Users</h2>
        <div className="users-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>About</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td>{userItem.role}</td>
                  <td>{userItem.about || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
