import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/home.css";
import heroVideo from "../assets/videos/hero-video.mp4";
import pesoLogo from "../assets/images/peso-logo.png";

export default function Home() {


  return (
    <div className="home-container">

      {/* Video Hero Section */}
      <section className="video-hero-section">
        <video 
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        
        <div className="video-overlay"></div>
        
        <div className="video-hero-content">
          <div className="hero-logo-container">
            <img src={pesoLogo} alt="PESO Marinduque Logo" className="hero-logo" />
          </div>
          
          <h1 className="hero-main-title">TRABAHO MANDIN!</h1>
          
          <p className="hero-tagline">Trabaho para sa Marinduqueño</p>
          
          <div className="hero-description">
            <p>
              Marinduque, proudly known as the Heart of the Philippines, is a province rich in culture, resilience, and community spirit. Through Online Employment in Marinduque, we connect local talent with opportunities, empowering every Marinduqueño to build a stronger future at home and beyond
            </p>
          </div>
          

        </div>
      </section>

      <section className="features-section">
        <h2>Find Work or Hire Talent</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="icon">👨‍💼</span>
            <h3>Job Seekers</h3>
            <p>Discover local job openings and apply online.</p>
          </div>
          <div className="feature-card">
            <span className="icon">🏢</span>
            <h3>Employers</h3>
            <p>Post vacancies and manage applicants in one place.</p>
          </div>
          <div className="feature-card">
            <span className="icon">📄</span>
            <h3>Resume Upload</h3>
            <p>Attach your resume when applying for jobs.</p>
          </div>
          <div className="feature-card">
            <span className="icon">📊</span>
            <h3>Admin Analytics</h3>
            <p>Track users, vacancies, and application activity.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create an account as a job seeker or employer.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Login</h3>
            <p>Sign in with your credentials.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Apply</h3>
            <p>Upload your resume and submit applications.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Manage</h3>
            <p>Employers review applicants and admins monitor analytics.</p>
          </div>
        </div>
      </section>
            {/* Bottom Section - Exact match to your reference */}
      <div className="bottom-green-section">
        {/* Top beige section */}
        <div className="bottom-beige-bar"></div>
        
        {/* Green section with content */}
        <div className="bottom-green-content">
          {/* Yellow accent line */}
          <div className="bottom-yellow-accent"></div>
          
          {/* Background image with overlay */}
          <div className="bottom-bg-overlay"></div>
          
          {/* Content container */}
          <div className="bottom-inner-container">
            {/* Yellow box with logo */}
            <div className="bottom-yellow-box">
              <img src={pesoLogo} alt="PESO Marinduque Logo" className="bottom-logo" />
            </div>
            
            {/* Text content */}
            <div className="bottom-text-content">
              <h1 className="bottom-main-title">STRAM PESO</h1>
              <p className="bottom-subtitle">Lalawigan ng Marinduque</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bottom-footer">
            <p>© 2025 Provincial Government of Marinduque. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}