import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsRes, statsRes] = await Promise.all([
        API.get("/projects/my-projects"),
        API.get("/projects/stats")
      ]);
      console.log("Projects:", projectsRes.data.projects);
      setProjects(projectsRes.data.projects || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleApproveWork = async (projectId) => {
    try {
      await API.put(`/projects/approve-work/${projectId}`);
      alert("Work approved! Project completed.");
      fetchData();
      setShowModal(false);
    } catch (error) {
      alert("Failed to approve work");
    }
  };

  const handleRejectWork = async (projectId) => {
    try {
      await API.put(`/projects/reject-work/${projectId}`);
      alert("Work rejected. Request revisions.");
      fetchData();
      setShowModal(false);
    } catch (error) {
      alert("Failed to reject work");
    }
  };

  const viewSubmission = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Dashboard</h1>
        <p>Manage your projects and review work submissions</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card"><h3>Total Projects</h3><p className="stat-number">{stats.total}</p></div>
        <div className="stat-card"><h3>Open</h3><p className="stat-number">{stats.open}</p></div>
        <div className="stat-card"><h3>In Progress</h3><p className="stat-number">{stats.active}</p></div>
        <div className="stat-card"><h3>Completed</h3><p className="stat-number">{stats.completed}</p></div>
      </div>
      
      <div className="section-header">
        <h2>My Projects</h2>
        <Link to="/client/create-project" className="btn-primary">New Project</Link>
      </div>
      
      {projects.length === 0 ? (
        <div className="empty-state">No projects yet. Create your first project.</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.title}</h3>
              <p className="budget">${project.budget?.toLocaleString()}</p>
              <p className="description">{project.description?.substring(0, 100)}...</p>
              
              {project.workSubmission?.status === "pending" && (
                <div className="pending-badge" onClick={() => viewSubmission(project)}>
                  📋 Pending work submission - Click to review
                </div>
              )}
              
              <div className="project-footer">
                <span className={`status ${project.status}`}>{project.status}</span>
                <Link to={`/client/project/${project._id}/applicants`} className="btn-secondary">View Applicants</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for reviewing submission */}
      {showModal && selectedProject && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000
        }} onClick={() => setShowModal(false)}>
          <div className="card" style={{ maxWidth: "500px" }} onClick={e => e.stopPropagation()}>
            <h2>Review Work Submission</h2>
            <p><strong>Project:</strong> {selectedProject.title}</p>
            <p><strong>GitHub Repository:</strong></p>
            <p><a href={selectedProject.workSubmission?.github} target="_blank" rel="noopener noreferrer">{selectedProject.workSubmission?.github}</a></p>
            <p><strong>Description:</strong></p>
            <p>{selectedProject.workSubmission?.description}</p>
            <p><strong>Submitted:</strong> {new Date(selectedProject.workSubmission?.submittedAt).toLocaleString()}</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button className="btn-accept" onClick={() => handleApproveWork(selectedProject._id)}>Approve & Complete</button>
              <button className="btn-reject" onClick={() => handleRejectWork(selectedProject._id)}>Request Changes</button>
            </div>
            <button className="btn-secondary" style={{ marginTop: "0.5rem" }} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}