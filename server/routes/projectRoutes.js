import express from "express";
import Project from "../models/Project.js";
import  verifyToken  from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import crypto from "crypto";


const router = express.Router();

// Create project
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      teamMembers: [req.user.id],
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all projects user is part of
router.get("/", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      teamMembers: req.user.id,    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update project
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add team member
 

router.post("/:id/admin-add-user", verifyToken, async (req, res) => {
  const projectId = req.params.id;
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const tempPassword = password || crypto.randomBytes(8).toString("hex");

      user = new User({
        name,
        email,
        password: tempPassword,
      });

      await user.save();
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.teamMembers.includes(user._id)) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.teamMembers.push(user._id);
    await project.save();

    res.status(200).json({ message: `User ${user.name} added to project!` });
  } catch (err) {
    console.error("Add-member error", err);
    res.status(500).json({ message: "Server error" });
  }
});




// Remove team member
router.post("/:id/remove-member", verifyToken, async (req, res) => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    project.teamMembers = project.teamMembers.filter(id => id.toString() !== memberId);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  

});


export default router;