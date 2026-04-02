import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          WorkWave
        </Link>
        <div className="nav-menu">
          {!user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              {user.role === 'client' ? (
                <>
                  <Link to="/client" className="nav-link">Dashboard</Link>
                  <Link to="/client/create-project" className="nav-link">Post Project</Link>
                </>
              ) : (
                <>
                  <Link to="/freelancer" className="nav-link">Find Work</Link>
                  <Link to="/freelancer/my-applications" className="nav-link">My Applications</Link>
                  <Link to="/freelancer/accepted" className="nav-link">My Projects</Link>
                </>
              )}
              <span style={{ fontSize: "0.9rem", color: "#64748b" }}>👋 {user.name}</span>
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;