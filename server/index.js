import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projectRoutes from "./routes/projectRoutes.js";
import verifyToken from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
  
  "https://project-manager-fronten.netlify.app/"
];
const app = express();
app.use(cors({
  origin:allowedOrigins,
  
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth',authRoutes);
app.use('/api/projects',verifyToken,projectRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

import userRoutes from './routes/usersRoutes.js';
app.use('/api/users', verifyToken,userRoutes);

import ticketRoutes from './routes/ticketsRoutes.js';
app.use('/api/tickets', verifyToken,ticketRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import commentRoutes from './routes/commentRoutes.js';
app.use('/api/comments', commentRoutes);