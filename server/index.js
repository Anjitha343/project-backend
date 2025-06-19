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
  "https://project-manager-fronten.netlify.app" // ✅ NO trailing slash
];

const app = express();

const originalUse = app.use.bind(app);

app.use = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('/:')) {
    console.error("❌ CRITICAL: Invalid path passed to app.use():", args[0]);
  }
  return originalUse(...args);
};

// ✅ Handle CORS properly
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin); // optional log
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

// ✅ Handle preflight (OPTIONS)
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS (OPTIONS)'));
    }
  },
  credentials: true
}));


app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', verifyToken, projectRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/tickets', verifyToken, ticketRoutes);
app.use('/api/comments', commentRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


