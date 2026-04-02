import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setError("");
    setSuccess("");
    setLoading(true);
    const result = await register(name, email, password, role);
    
    if (result.success) {
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <input 
          className="input" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="input" 
          type="email"
          placeholder="Email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          className="input" 
          placeholder="Password (min 6 characters)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <select 
          className="input" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="freelancer">💼 I'm a Freelancer - Looking for work</option>
          <option value="client">🏢 I'm a Client - Hiring talent</option>
        </select>
        <button className="btn" onClick={handleRegister} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#718096" }}>
          Already have an account? <Link to="/login" style={{ color: "#667eea" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}