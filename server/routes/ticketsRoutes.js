import express from 'express';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Create ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, priority, status, assignee, projectId } = req.body;
    const existingTicket = await Ticket.findOne({ title: req.body.title, projectId: req.body.projectId });
if (existingTicket) {
   res.status(400).json({ message: 'Ticket with this title already exists in this project.' });
}


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


router.put('/tickets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ projectId: req.params.projectId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});
router.put('/:ticketId',verifyToken, async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      req.body, 
      { new: true }
    );
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update ticket' });
  }
});

import updateTicketStatus from '../controllers/ticketControllers.js'
router.put('/tickets/:id',verifyToken, updateTicketStatus);

router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignee, search } = req.query;

    const query = { projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query).populate('assignee');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

import deleteTicket from '../controllers/deleteTicket.js';
router.delete('/:id', verifyToken, deleteTicket);


export default router;
