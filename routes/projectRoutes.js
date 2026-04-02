const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// CLIENT ROUTES
router.post("/create", authMiddleware, roleMiddleware("client"), createProject);
router.get("/my-projects", authMiddleware, roleMiddleware("client"), getMyProjects);
router.get("/stats", authMiddleware, roleMiddleware("client"), getDashboardStats);
router.get("/:id/applicants", authMiddleware, roleMiddleware("client"), getApplicants);
router.put("/application/status", authMiddleware, roleMiddleware("client"), updateApplicationStatus);
router.put("/approve-work/:id", authMiddleware, roleMiddleware("client"), approveWork);
router.put("/reject-work/:id", authMiddleware, roleMiddleware("client"), rejectWork);

// FREELANCER ROUTES
router.get("/", authMiddleware, getProjects);
router.post("/apply/:id", authMiddleware, roleMiddleware("freelancer"), applyToProject);
router.get("/my-applications", authMiddleware, roleMiddleware("freelancer"), getMyApplications);
router.get("/accepted", authMiddleware, roleMiddleware("freelancer"), getAcceptedProjects);
router.post("/submit-work/:id", authMiddleware, roleMiddleware("freelancer"), submitWork);

module.exports = router;