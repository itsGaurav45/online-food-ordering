import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


dotenv.config();

connectDB();

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
  res.send('API is running...');
});

app.use('/api/foods', foodRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 5000;

// Socket.io logic for live tracking simulation
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  let trackInterval;

  socket.on('startTracking', (orderId) => {
    console.log(`Started tracking order: ${orderId}`);
    
    // Lucknow Coordinates
    // Hazratganj (Restaurant) -> Gomti Nagar (User)
    const startPoint = { lat: 26.8467, lng: 80.9462 };
    const endPoint = { lat: 26.8522, lng: 80.9994 };
    
    let progress = 15; // Start at 15% (e.g., packing)
    
    if (trackInterval) clearInterval(trackInterval);

    trackInterval = setInterval(() => {
      progress += 2.5; // Smooth increment
      if (progress >= 100) {
        progress = 100;
        clearInterval(trackInterval);
      }

      // Calculate current position if dispatched (>60%)
      let currentLat = startPoint.lat;
      let currentLng = startPoint.lng;

      if (progress > 60) {
        const ratio = (progress - 60) / 40;
        currentLat = startPoint.lat + (endPoint.lat - startPoint.lat) * ratio;
        currentLng = startPoint.lng + (endPoint.lng - startPoint.lng) * ratio;
      }

      // Calculate ETA (roughly 15 mins to start, decrementing)
      const eta = Math.max(1, Math.ceil(15 * (1 - progress / 100)));

      socket.emit('locationUpdate', {
        progress,
        eta,
        riderPos: [currentLat, currentLng],
        restaurantPos: [startPoint.lat, startPoint.lng],
        userPos: [endPoint.lat, endPoint.lng]
      });
    }, 2000); // Update every 2 seconds for smooth movement
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (trackInterval) clearInterval(trackInterval);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
