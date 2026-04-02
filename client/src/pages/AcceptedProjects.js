import { useEffect, useState } from "react";
import API from "../services/api";

export default function AcceptedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [github, setGithub] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects/accepted");
      console.log("Accepted projects:", res.data);
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  const handleSubmitWork = async (projectId) => {
    if (!github) {
      setError("Please provide a GitHub repository URL");
      return;
    }
    
    setError("");
    setSubmitting(true);

    try {
      console.log("Submitting work for project:", projectId);
      console.log("Data:", { github, description });
      
      const response = await API.post(`/projects/submit-work/${projectId}`, {
        github: github,
        description: description
      });
      
      console.log("Response:", response.data);
      
      if (response.data.success) {
        alert("Work submitted successfully!");
        setShowModal(null);
        setGithub("");
        setDescription("");
        fetchProjects();
      } else {
        setError(response.data.message || "Failed to submit work");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.response?.data?.message || "Failed to submit work");
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Active Projects</h1>
        <p>Projects you're currently working on</p>
      </div>
      
      {projects.length === 0 ? (
        <div className="empty-state">No active projects yet. Keep applying!</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.title}</h3>
              <p className="budget">${project.budget?.toLocaleString()}</p>
              <p className="description">{project.description}</p>
              {project.skills?.length > 0 && (
                <div className="skills">
                  {project.skills.map((skill, idx) => <span key={idx} className="skill-tag">{skill}</span>)}
                </div>
              )}
              
              {project.workSubmission?.status === "pending" ? (
                <div className="pending-badge" style={{ background: "#dcfce7", color: "#166534" }}>
                  ✓ Work submitted - Awaiting client review
                  <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                    GitHub: <a href={project.workSubmission.github} target="_blank" rel="noopener noreferrer">{project.workSubmission.github}</a>
                  </div>
                </div>
              ) : (
                <div className="work-section">
                  <button className="btn-primary" onClick={() => setShowModal(project)}>Submit Work</button>
                </div>
              )}
              
              <div className="project-footer">
                <span className="status-accepted">In Progress</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for submitting work */}
      {showModal && (
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
        }} onClick={() => setShowModal(null)}>
          <div className="card" style={{ maxWidth: "500px" }} onClick={e => e.stopPropagation()}>
            <h2>Submit Your Work</h2>
            <input
              className="input"
              placeholder="GitHub Repository URL"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <textarea
              className="input"
              rows="4"
              placeholder="Describe your work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <button
              className="btn"
              onClick={() => handleSubmitWork(showModal._id)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Work"}
            </button>
            <button
              className="btn-secondary"
              style={{ marginTop: "0.5rem" }}
              onClick={() => setShowModal(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}