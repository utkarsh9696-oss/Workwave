import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Applicants() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/projects/${id}/applicants`);
      setApplicants(res.data.applicants);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (userId, status) => {
    try {
      await API.put("/projects/application/status", { projectId: id, userId, status });
      alert(`Application ${status}`);
      fetchApplicants();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/client")} className="btn-secondary">← Back</button>
      <h1>Applicants</h1>

      {applicants.length === 0 ? (
        <div className="empty-state">No applicants yet</div>
      ) : (
        <div className="applicants-list">
          {applicants.map((app) => (
            <div key={app.user._id} className="applicant-card">
              <div className="applicant-info">
                <h3>{app.user.name}</h3>
                <p>{app.user.email}</p>
                <span className={`status-${app.status}`}>{app.status}</span>
              </div>

              {app.status === "pending" && (
                <div className="applicant-actions">
                  <button
                    className="btn-accept"
                    onClick={() => updateStatus(app.user._id, "accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="btn-reject"
                    onClick={() => updateStatus(app.user._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}