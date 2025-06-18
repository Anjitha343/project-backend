import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projectRoutes from "./routes/projectRoutes.js";
import verifyToken from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
import userRoutes from './routes/usersRoutes.js';
import ticketRoutes from './routes/ticketsRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://project-manager-fronten.netlify.app" 
];

const app = express();


app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin); 
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use('/api/auth', authRoutes);
app.use('/api/projects', verifyToken, projectRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/tickets', verifyToken, ticketRoutes);
app.use('/api/comments', commentRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

