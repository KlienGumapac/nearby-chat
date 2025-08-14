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

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const activeUsers = new Map();
const userChats = new Map();

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

function findNearbyUsers(userId, userLat, userLon, radius = 500) {
  const nearbyUsers = [];
  
  activeUsers.forEach((userData, id) => {
    if (id !== userId && userData.location) {
      const distance = calculateDistance(
        userLat, userLon, 
        userData.location.lat, userData.location.lon
      ) * 1000; 
      
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

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user-join', (data) => {
    const { username, location } = data;
    
    activeUsers.set(socket.id, {
      username: username,
      location: location,
      joinedAt: new Date(),
      isOnline: true
    });

    console.log(`User ${username} joined at location:`, location);
    
    const currentUsers = Array.from(activeUsers.entries())
      .filter(([id, userData]) => id !== socket.id && userData.location)
      .map(([id, userData]) => ({
        id: id,
        username: userData.username,
        location: userData.location,
        distance: 0 
      }));
    
    socket.emit('current-users', currentUsers);
    
    socket.broadcast.emit('user-joined', {
      id: socket.id,
      username: username,
      location: location
    });
  });

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

      const chatKey = [socket.id, toUserId].sort().join('-');
      if (!userChats.has(chatKey)) {
        userChats.set(chatKey, []);
      }
      userChats.get(chatKey).push(messageData);

      socket.to(toUserId).emit('receive-message', messageData);
      
      socket.emit('message-sent', messageData);
    }
  });

  socket.on('get-chat-history', (otherUserId) => {
    const chatKey = [socket.id, otherUserId].sort().join('-');
    const chatHistory = userChats.get(chatKey) || [];
    socket.emit('chat-history', {
      otherUserId: otherUserId,
      messages: chatHistory
    });
  });

  socket.on('update-location', (location) => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      userData.location = location;
      activeUsers.set(socket.id, userData);
      
      socket.broadcast.emit('user-location-updated', {
        id: socket.id,
        location: location
      });
    }
  });

  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      console.log(`User ${userData.username} disconnected`);
      
      activeUsers.delete(socket.id);
      
      userChats.forEach((chat, key) => {
        if (key.includes(socket.id)) {
          userChats.delete(key);
        }
      });
      
      socket.broadcast.emit('user-disconnected', socket.id);
    }
  });
});

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