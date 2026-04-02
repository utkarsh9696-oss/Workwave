import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import CreateProject from "./pages/CreateProject";
import Applicants from "./pages/Applicants";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import MyApplications from "./pages/MyApplications";
import AcceptedProjects from "./pages/AcceptedProjects";

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={!user ? <Landing /> : (user.role === "client" ? <Navigate to="/client" /> : <Navigate to="/freelancer" />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<ProtectedRoute allowedRoles={["client"]}><ClientDashboard /></ProtectedRoute>} />
        <Route path="/client/create-project" element={<ProtectedRoute allowedRoles={["client"]}><CreateProject /></ProtectedRoute>} />
        <Route path="/client/project/:id/applicants" element={<ProtectedRoute allowedRoles={["client"]}><Applicants /></ProtectedRoute>} />
        <Route path="/freelancer" element={<ProtectedRoute allowedRoles={["freelancer"]}><FreelancerDashboard /></ProtectedRoute>} />
        <Route path="/freelancer/my-applications" element={<ProtectedRoute allowedRoles={["freelancer"]}><MyApplications /></ProtectedRoute>} />
        <Route path="/freelancer/accepted" element={<ProtectedRoute allowedRoles={["freelancer"]}><AcceptedProjects /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;