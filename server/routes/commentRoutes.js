import express from 'express';
import Comment from '../models/Comment.js';
import  verifyToken  from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
  const { ticketId, text } = req.body;
  const userId = req.user.id;

  try {
    const comment = new Comment({ ticketId, userId, text });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

router.get('/:ticketId', verifyToken, async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.ticketId })
      .populate('userId', 'name email') // Optional: show commenter's name/email
      .sort({ timestamp: 1 }); // Oldest first
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

export default router;
