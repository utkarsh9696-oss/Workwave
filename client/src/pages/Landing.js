import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-content">
          <h1>Connect. Create. Collaborate.</h1>
          <p>Find top freelancers or discover your next project</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-primary">Get Started →</Link>
            <Link to="/login" className="btn-hero-secondary">Sign In</Link>
          </div>
        </div>
      </div>
      
      <div className="features">
        <h2>Why Choose WorkWave?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast & Easy</h3>
            <p>Post projects and get proposals instantly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Secure Payments</h3>
            <p>Pay only when satisfied with work</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Talent</h3>
            <p>Access freelancers worldwide</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>24/7 Support</h3>
            <p>We're here to help you succeed</p>
          </div>
        </div>
      </div>
    </div>
  );
}