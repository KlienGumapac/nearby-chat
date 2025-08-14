# Proximity Chat App

A real-time messaging web application that allows users to discover and chat with people nearby using geolocation. Users can scan for nearby users, start conversations, and enjoy real-time messaging with unread message indicators.

## ✨ Features

- **Proximity-based User Discovery**: Find users within 500 meters of your location
- **Real-time Messaging**: Instant messaging with nearby users using Socket.io
- **Unread Message Indicators**: Red badges and counters for unread messages
- **No Registration Required**: Just enter a username and start chatting
- **Temporary Chat History**: Messages are stored only during the session
- **Mobile-friendly Design**: Responsive UI optimized for mobile devices
- **Live Location Updates**: Automatic location updates every 30 seconds
- **Thought Bubble Indicators**: Visual indicators showing last message from other users
- **Chat List Management**: View all active conversations with unread counts

## 🛠️ Tech Stack

### Frontend Technologies

- **React.js** (v18+) - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** (v3.4.0) - Utility-first CSS framework for rapid UI development
- **PostCSS** - CSS processing tool for Tailwind CSS
- **Autoprefixer** - Automatically adds vendor prefixes to CSS

### Backend Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework for Node.js
- **Socket.io** - Real-time bidirectional communication library
- **CORS** - Cross-Origin Resource Sharing middleware

### Development Tools

- **Nodemon** - Automatically restarts server during development
- **Concurrently** - Run multiple commands simultaneously
- **Create React App** - React application boilerplate with TypeScript template

### APIs & Services

- **Browser Geolocation API** - Native browser location services
- **Haversine Formula** - Mathematical formula for calculating distances between coordinates

### Package Managers

- **npm** - Node.js package manager for dependency management

### Build Tools

- **Webpack** (via Create React App) - Module bundler
- **Babel** (via Create React App) - JavaScript compiler
- **TypeScript Compiler** - TypeScript to JavaScript compilation

### Version Control

- **Git** - Distributed version control system
- **GitHub** - Code hosting platform

### Browser APIs

- **WebSocket API** - Real-time communication protocol
- **Geolocation API** - Location services
- **Local Storage** - Client-side data storage (if needed)

## 📋 Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Modern web browser** with geolocation support
- **Git** (for cloning the repository)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/KlienGumapac/nearby-chat.git
cd nearby-chat
```

### Step 2: Install All Dependencies

```bash
# Install root dependencies (server + dev tools)
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Environment Setup

Create a `.env` file in the root directory (optional):

```env
PORT=5000
NODE_ENV=development
```

## 🏃‍♂️ Running the Application

### Option 1: Run Both Server and Client (Recommended)

```bash
npm run dev
```

This will start both the server (port 5000) and client (port 3000) simultaneously.

### Option 2: Run Separately

**Terminal 1 - Start Server:**

```bash
npm run server
# or
node server.js
```

**Terminal 2 - Start Client:**

```bash
cd client
npm start
```

### Option 3: Production Build

```bash
# Build the client
npm run build

# Start production server
npm start
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 How to Use

### Getting Started

1. **Open the app** in your browser at http://localhost:3000
2. **Enter your username** and click "Start Chatting"
3. **Allow location access** when prompted by your browser
4. **Tap the scan button** to discover nearby users

### Chatting with Users

1. **Scan for users** - See all users within 500 meters
2. **Click on user bubbles** - Start a conversation
3. **Send messages** - Real-time messaging with nearby users
4. **View chat list** - Click the chat icon to see all conversations
5. **Check unread messages** - Red badges show unread message counts

### Features Explained

- **Red Badges**: Show unread message counts on user avatars
- **"X new" Text**: Indicates number of unread messages
- **Thought Bubbles**: Show preview of last message from other users
- **Distance Display**: Shows how far away users are
- **Connection Status**: Green/red dot indicates server connection

## 🔧 Available Scripts

### Root Directory

```bash
npm run dev          # Start both server and client
npm run server       # Start server only
npm run client       # Start client only
npm run build        # Build client for production
npm start           # Start production server
npm run install-all  # Install all dependencies
```

### Client Directory

```bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App
```

## 📁 Project Structure

```
nearby-chat/
├── server.js                    # Express server with Socket.io
├── package.json                 # Root dependencies and scripts
├── .env                        # Environment variables (optional)
├── README.md                   # This file
├── LICENSE                     # MIT License
├── test.html                   # Quick test page
└── client/                     # React frontend
    ├── public/                 # Static files
    ├── src/
    │   ├── components/         # React components
    │   │   ├── ChatInterface.tsx
    │   │   ├── ChatList.tsx
    │   │   ├── MainApp.tsx
    │   │   ├── ScanButton.tsx
    │   │   ├── UserBubbles.tsx
    │   │   └── UsernameScreen.tsx
    │   ├── types.ts            # TypeScript interfaces
    │   ├── App.tsx             # Main app component
    │   ├── index.tsx           # App entry point
    │   └── index.css           # Tailwind CSS styles
    ├── package.json            # Client dependencies
    ├── tailwind.config.js      # Tailwind configuration
    ├── postcss.config.js       # PostCSS configuration
    └── tsconfig.json           # TypeScript configuration
```

## 🔌 API Endpoints

- `GET /api/users` - Get all active users
- `GET /api/health` - Health check endpoint

## 📡 Socket Events

### Client → Server

- `user-join` - User joins with username and location
- `scan-users` - Request nearby users
- `send-message` - Send message to specific user
- `get-chat-history` - Get chat history with user
- `update-location` - Update user location

### Server → Client

- `current-users` - Receive list of current online users
- `nearby-users` - Receive list of nearby users
- `receive-message` - Receive message from another user
- `user-joined` - New user joined
- `user-disconnected` - User disconnected
- `chat-history` - Chat history with specific user

## 🎨 UI Components

### Core Components

- **UsernameScreen**: Initial username entry and location permission
- **MainApp**: Main application interface with scan and chat views
- **ScanButton**: Animated scan button with user count badge
- **UserBubbles**: Display nearby users with thought bubble indicators
- **ChatInterface**: Individual chat conversation interface
- **ChatList**: List of all active conversations with unread counts

### Key Features

- **Responsive Design**: Works on mobile and desktop
- **Real-time Updates**: Live user presence and message updates
- **Unread Indicators**: Red badges and counters for new messages
- **Smooth Animations**: Hover effects and transitions
- **Connection Status**: Visual indicators for server connection

## 🔒 Security & Privacy

- **No Persistent Storage**: All data is temporary and session-based
- **Location Consent**: Users must explicitly allow location access
- **No User Registration**: Simple username-based identification
- **Temporary Messages**: Chat history resets after session ends

## 🌍 Browser Support

- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+
- **Mobile browsers** with geolocation support

## 🐛 Troubleshooting

### Common Issues

**"This site can't be reached"**

- Make sure both server (port 5000) and client (port 3000) are running
- Check if ports are already in use: `netstat -ano | findstr :3000`

**Location not working**

- Ensure browser has location permissions
- Try refreshing the page and allowing location again

**Users not appearing**

- Check if other users are online and within 500 meters
- Try scanning again or refreshing the page

**Socket connection issues**

- Check server console for connection logs
- Ensure firewall isn't blocking the connection

### Development Issues

**Port already in use**

```bash
# Kill processes using ports
taskkill /F /IM node.exe
# Then restart the application
```

**Dependencies issues**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository: [nearby-chat](https://github.com/KlienGumapac/nearby-chat)
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

We welcome contributions! Please feel free to submit issues and pull requests.

## 👨‍💻 Author

**Klien Gumapac**

- GitHub: [@KlienGumapac](https://github.com/KlienGumapac)
- Repository: [nearby-chat](https://github.com/KlienGumapac/nearby-chat.git)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/KlienGumapac/nearby-chat/issues)
- **Documentation**: Check this README for setup instructions
- **Repository**: [View source code](https://github.com/KlienGumapac/nearby-chat)
- **Author**: [Klien Gumapac](https://github.com/KlienGumapac)

---

**Happy Chatting! 🚀**
