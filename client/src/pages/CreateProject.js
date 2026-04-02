import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || !budget) {
      setError("Please fill all required fields");
      return;
    }
    
    setError("");
    setLoading(true);
    const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s);
    
    try {
      await API.post("/projects/create", {
        title,
        description,
        budget: Number(budget),
        skills: skillsArray
      });
      alert("Project created!");
      navigate("/client");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create project");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create Project</h2>
        {error && <div className="error-message">{error}</div>}
        <input className="input" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input" rows="4" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="input" type="number" placeholder="Budget (₹)" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <input className="input" placeholder="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} />
        <button className="btn" onClick={handleSubmit} disabled={loading}>{loading ? "Creating..." : "Create Project"}</button>
      </div>
    </div>
  );
}