const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store active users and their data
const activeUsers = new Map();
const userChats = new Map();

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Find nearby users within specified radius (in meters)
function findNearbyUsers(userId, userLat, userLon, radius = 500) {
  const nearbyUsers = [];
  
  activeUsers.forEach((userData, id) => {
    if (id !== userId && userData.location) {
      const distance = calculateDistance(
        userLat, userLon, 
        userData.location.lat, userData.location.lon
      ) * 1000; // Convert to meters
      
      if (distance <= radius) {
        nearbyUsers.push({
          id: id,
          username: userData.username,
          distance: Math.round(distance),
          location: userData.location
        });
      }
    }
  });
  
  return nearbyUsers;
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with username and location
  socket.on('user-join', (data) => {
    const { username, location } = data;
    
    activeUsers.set(socket.id, {
      username: username,
      location: location,
      joinedAt: new Date(),
      isOnline: true
    });

    console.log(`User ${username} joined at location:`, location);
    
    // Send current online users to the new user
    const currentUsers = Array.from(activeUsers.entries())
      .filter(([id, userData]) => id !== socket.id && userData.location)
      .map(([id, userData]) => ({
        id: id,
        username: userData.username,
        location: userData.location,
        distance: 0 // Will be calculated when they scan
      }));
    
    socket.emit('current-users', currentUsers);
    
    // Notify other users about new user
    socket.broadcast.emit('user-joined', {
      id: socket.id,
      username: username,
      location: location
    });
  });

  // User requests nearby users
  socket.on('scan-users', (userLocation) => {
    const userData = activeUsers.get(socket.id);
    if (userData && userLocation) {
      const nearbyUsers = findNearbyUsers(
        socket.id, 
        userLocation.lat, 
        userLocation.lon
      );
      
      socket.emit('nearby-users', nearbyUsers);
    }
  });

  // Send message to specific user
  socket.on('send-message', (data) => {
    const { toUserId, message } = data;
    const fromUser = activeUsers.get(socket.id);
    
    if (fromUser) {
      const messageData = {
        from: socket.id,
        fromUsername: fromUser.username,
        to: toUserId,
        message: message,
        timestamp: new Date()
      };

      // Store message in chat history
      const chatKey = [socket.id, toUserId].sort().join('-');
      if (!userChats.has(chatKey)) {
        userChats.set(chatKey, []);
      }
      userChats.get(chatKey).push(messageData);

      // Send to recipient
      socket.to(toUserId).emit('receive-message', messageData);
      
      // Send confirmation to sender
      socket.emit('message-sent', messageData);
    }
  });

  // Get chat history
  socket.on('get-chat-history', (otherUserId) => {
    const chatKey = [socket.id, otherUserId].sort().join('-');
    const chatHistory = userChats.get(chatKey) || [];
    socket.emit('chat-history', {
      otherUserId: otherUserId,
      messages: chatHistory
    });
  });

  // User location update
  socket.on('update-location', (location) => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      userData.location = location;
      activeUsers.set(socket.id, userData);
      
      // Notify other users about location update
      socket.broadcast.emit('user-location-updated', {
        id: socket.id,
        location: location
      });
    }
  });

  // User disconnection
  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      console.log(`User ${userData.username} disconnected`);
      
      // Remove user from active users
      activeUsers.delete(socket.id);
      
      // Remove user's chat history
      userChats.forEach((chat, key) => {
        if (key.includes(socket.id)) {
          userChats.delete(key);
        }
      });
      
      // Notify other users about disconnection
      socket.broadcast.emit('user-disconnected', socket.id);
    }
  });
});

// API Routes
app.get('/api/users', (req, res) => {
  const users = Array.from(activeUsers.entries()).map(([id, data]) => ({
    id: id,
    username: data.username,
    isOnline: data.isOnline
  }));
  res.json(users);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', activeUsers: activeUsers.size });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Active users: ${activeUsers.size}`);
}); 