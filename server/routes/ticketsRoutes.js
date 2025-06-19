import express from 'express';
import Ticket from '../models/Ticket.js';
import verifyToken from '../middleware/authMiddleware.js';
import updateTicketStatus from '../controllers/ticketControllers.js';
import deleteTicket from '../controllers/deleteTicket.js';

const router = express.Router();

// ✅ Create ticket
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, priority, status, assignee, projectId } = req.body;
    const existingTicket = await Ticket.findOne({ title, projectId });

    if (existingTicket) {
      return res.status(400).json({ message: 'Ticket with this title already exists in this project.' });
    }

    const ticket = new Ticket({ title, description, priority, status, assignee, projectId });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get tickets by project with filters
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

// ✅ Update ticket (general update)
router.put('/:ticketId', verifyToken, async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.ticketId, req.body, { new: true });
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update ticket' });
  }
});

// ✅ Update ticket status only
router.put('/status/:id', verifyToken, updateTicketStatus);

// ✅ Delete ticket
router.delete('/:id', verifyToken, deleteTicket);

router.stack.forEach((layer) => {
  if (layer.route) {
    console.log("📦 Registered route:", layer.route.path);
  }
});


export default router;
