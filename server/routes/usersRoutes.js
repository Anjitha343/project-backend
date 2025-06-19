import express from 'express';
import User from '../models/User.js'; 
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, 'name email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  router.stack.forEach((layer) => {
  if (layer.route) {
    console.log("📦 Registered route:", layer.route.path);
  }
});

});

export default router;
