const Project = require("../models/Project");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { title, description, budget, skills } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      skills,
      createdBy: req.user.id
    });

    res.status(201).json({ message: "Project created", project });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy", "name email");
    res.json({ projects });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY PROJECTS (CLIENT)
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id });
    res.json({ projects });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPLY TO PROJECT
const applyToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const alreadyApplied = project.applications.find(
      (app) => app.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    project.applications.push({ user: req.user.id });
    await project.save();

    res.json({ message: "Applied successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET APPLICANTS
const getApplicants = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("applications.user", "name email role");
    res.json({ applicants: project.applications });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACCEPT / REJECT APPLICATION
const updateApplicationStatus = async (req, res) => {
  try {
    const { projectId, userId, status } = req.body;
    const project = await Project.findById(projectId);
    const application = project.applications.find(
      (app) => app.user.toString() === userId
    );
    application.status = status;
    if (status === "accepted") {
      project.status = "in-progress";
    }
    await project.save();
    res.json({ message: `Application ${status}` });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY APPLICATIONS (FREELANCER)
const getMyApplications = async (req, res) => {
  try {
    const projects = await Project.find({
      "applications.user": req.user.id
    });
    res.json({ projects });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ACCEPTED PROJECTS (FREELANCER)
const getAcceptedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      applications: {
        $elemMatch: {
          user: req.user.id,
          status: "accepted"
        }
      }
    });
    res.json({ projects });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DASHBOARD STATS (CLIENT)
const getDashboardStats = async (req, res) => {
  try {
    const total = await Project.countDocuments({ createdBy: req.user.id });
    const open = await Project.countDocuments({ createdBy: req.user.id, status: "open" });
    const active = await Project.countDocuments({ createdBy: req.user.id, status: "in-progress" });
    const completed = await Project.countDocuments({ createdBy: req.user.id, status: "completed" });

    res.json({ total, open, active, completed });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========== SUBMIT WORK ==========
const submitWork = async (req, res) => {
  try {
    console.log("===== SUBMIT WORK =====");
    console.log("Project ID:", req.params.id);
    console.log("User ID:", req.user.id);
    console.log("Body:", req.body);
    
    const { github, description } = req.body;
    const projectId = req.params.id;
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Check if freelancer is assigned
    const isAssigned = project.applications.some(
      app => app.user.toString() === req.user.id && app.status === "accepted"
    );
    
    if (!isAssigned) {
      return res.status(403).json({ message: "You are not assigned to this project" });
    }
    
    // Save the work submission
    project.workSubmission = {
      github: github,
      description: description,
      submittedBy: req.user.id,
      submittedAt: new Date(),
      status: "pending"
    };
    
    await project.save();
    
    console.log("Work submitted successfully!");
    
    res.json({ 
      success: true,
      message: "Work submitted successfully! The client will review it.",
      workSubmission: project.workSubmission
    });
    
  } catch (error) {
    console.error("Submit work error:", error);
    res.status(500).json({ message: error.message });
  }
};

// APPROVE WORK
const approveWork = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't own this project" });
    }
    
    if (!project.workSubmission || project.workSubmission.status !== "pending") {
      return res.status(400).json({ message: "No pending work submission found" });
    }
    
    project.workSubmission.status = "approved";
    project.status = "completed";
    await project.save();
    
    res.json({ message: "Work approved! Project completed." });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REJECT WORK
const rejectWork = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't own this project" });
    }
    
    if (!project.workSubmission || project.workSubmission.status !== "pending") {
      return res.status(400).json({ message: "No pending work submission found" });
    }
    
    project.workSubmission.status = "rejected";
    await project.save();
    
    res.json({ message: "Work rejected. Request revisions." });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getMyProjects,
  applyToProject,
  getApplicants,
  updateApplicationStatus,
  getMyApplications,
  getAcceptedProjects,
  getDashboardStats,
  submitWork,
  approveWork,
  rejectWork
};