import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Create ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, priority, status, assignee, projectId } = req.body;

    const ticket = new Ticket({
      title,
      description,
      priority,
      status,
      assignee,
      projectId,
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tickets by project ID
router.get("/project/:projectId", verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ projectId: req.params.projectId }).populate("assignee", "name");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
