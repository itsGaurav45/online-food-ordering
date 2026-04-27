import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

console.log('Google Client ID Loaded:', process.env.GOOGLE_CLIENT_ID ? 'YES' : 'NO');

const dbConnected = await connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('BiteBolt API is running...');
});

app.use('/api/foods', foodRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('update-location', (data) => {
    io.emit('location-update', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
