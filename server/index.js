import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/usersRoutes.js';
import ticketRoutes from './routes/ticketsRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import verifyToken from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://project-manager-fronten.netlify.app"
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', verifyToken, projectRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/tickets', verifyToken, ticketRoutes);
app.use('/api/comments', commentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('MongoDB connection error:', err));
