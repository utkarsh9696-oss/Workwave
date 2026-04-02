import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setError("");
    setSuccess("");
    setLoading(true);
    const result = await login(email, password);
    
    if (result.success) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate(result.role === "client" ? "/client" : "/freelancer");
      }, 1500);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Welcome Back</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
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
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button className="btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Sign In"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#718096" }}>
          Don't have an account? <Link to="/register" style={{ color: "#667eea" }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}