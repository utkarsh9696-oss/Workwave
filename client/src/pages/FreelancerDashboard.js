import { useEffect, useState } from "react";
import API from "../services/api";

export default function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleApply = async (projectId) => {
    setApplying({ ...applying, [projectId]: true });
    try {
      await API.post(`/projects/apply/${projectId}`);
      alert("Application submitted successfully");
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply");
    }
    setApplying({ ...applying, [projectId]: false });
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div><p>Loading projects...</p></div>;
  }

  const openProjects = projects.filter(p => p.status === "open");
  const userStr = localStorage.getItem('user');
  const userId = userStr ? JSON.parse(userStr)._id : null;

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Find Work</h1>
        <p>Browse available projects and apply to opportunities</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card"><h3>Available Projects</h3><p className="stat-number">{openProjects.length}</p></div>
        <div className="stat-card"><h3>Applications Sent</h3><p className="stat-number">{projects.filter(p => p.applications?.some(a => a.user === userId)).length}</p></div>
        <div className="stat-card"><h3>Active Projects</h3><p className="stat-number">{projects.filter(p => p.applications?.some(a => a.user === userId && a.status === "accepted")).length}</p></div>
        <div className="stat-card"><h3>Total Earnings</h3><p className="stat-number">$0</p></div>
      </div>
      
      <div className="section-header">
        <h2>Available Projects</h2>
      </div>
      
      {openProjects.length === 0 ? (
        <div className="empty-state">No open projects available at the moment.</div>
      ) : (
        <div className="projects-grid">
          {openProjects.map((project) => {
            const isApplied = project.applications?.some(app => app.user === userId);
            return (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p className="budget">${project.budget?.toLocaleString()}</p>
                <p className="description">{project.description}</p>
                {project.skills?.length > 0 && (
                  <div className="skills">
                    {project.skills.map((skill, idx) => <span key={idx} className="skill-tag">{skill}</span>)}
                  </div>
                )}
                <div className="project-footer">
                  <span className="status open">Open</span>
                  <button className="btn-apply" onClick={() => handleApply(project._id)} disabled={applying[project._id] || isApplied}>
                    {isApplied ? "Applied" : applying[project._id] ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}