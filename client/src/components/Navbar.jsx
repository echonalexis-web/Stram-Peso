import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";
import pesoLogo from "../assets/images/peso-logo.png";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      

        <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="nav-logo-section">
          <div className="nav-logo-icon">
            <img src={pesoLogo} alt="PESO Marinduque Logo" />
          </div>
          <span className="nav-logo-text">STRAM PESO</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {user ? (
            <>
              <span className="user-name">👤 {user.name}</span>

              {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}

              {user.role === "employer" && (
                <>
                  <Link to="/employer">Employer Dashboard</Link>
                  <Link to="/post-job">Post Vacancy</Link>
                </>
              )}

              {user.role === "resident" && (
                <>
                  <Link to="/dashboard">My Dashboard</Link>
                  <Link to="/jobs">Browse Jobs</Link>
                </>
              )}

              <Link to="/profile">Profile</Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/register-employer">Register as Employer</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
