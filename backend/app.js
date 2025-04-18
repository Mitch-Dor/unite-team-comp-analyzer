const express = require("express");
const path = require("path");
const database = require('./database.js');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
// Add middleware to parse JSON bodies
app.use(express.json());
// Add middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const proxy = {
  target: 'http://localhost:3001', //chatGPT told me to do :3000 LIES
  changeOrigin: true
};

// Setup the proxy middleware
app.use('/api', createProxyMiddleware(proxy));
app.use('/dev', createProxyMiddleware(proxy));

// Basic route
app.get('/', (req, res) => {
  console.log("backend hit");
  res.send('Hello World');
});

app.get('/ping', (req, res) => {
  console.log("backend hit");
  res.json({message: 'Pong'});
});

app.use(express.static(
  path.resolve(__dirname, "public")
));

// Socket.IO connection handler
require('./socket/socketManager')(io);

// Start the server
server.listen(3001, () => console.log("Backend Started On Port 3001"));

// Routes
require('./routes/characters.js')(app, database);
require('./routes/teams.js')(app, database);
require('./routes/draftRoom.js')(app, database, io);