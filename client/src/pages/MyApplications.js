import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects/my-applications");
      setApplications(res.data.projects);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div><p>Loading...</p></div>;
  }

  const userStr = localStorage.getItem('user');
  const userId = userStr ? JSON.parse(userStr)._id : null;

  const getStatusClass = (status) => {
    switch(status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="dashboard-container">
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <div className="empty-state">No applications yet</div>
      ) : (
        <div className="projects-grid">
          {applications.map((project) => {
            const app = project.applications?.find(a => a.user === userId);
            return (
              <div key={project._id} className="project-card">
                <h3>{project.title}</h3>
                <p className="budget">₹{project.budget}</p>
                <p className="description">{project.description?.substring(0, 100)}</p>
                <div className="project-footer">
                  <span className={getStatusClass(app?.status)}>{app?.status || 'pending'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}