// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const path = require("path");
const database = require('./database.js');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Setup CORS - consider restricting to just your frontend origin for security
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true // Important for cookies/sessions with OAuth
}));

// Add middleware to parse JSON bodies
app.use(express.json());
// Add middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Set up session - MUST be before passport initialization
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

// Initialize passport and session - MUST be after session middleware but before routes
app.use(passport.initialize());
app.use(passport.session());

// Initialize the Auth class
const auth = database.auth;

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Use the signIn function to handle user sign-in and registration
      const user = await auth.signIn(profile.id, profile.displayName, profile.emails[0].value);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.user_google_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await auth.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const proxy = {
  target: 'http://localhost:3001',
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

// Routes - load AFTER all middleware is set up
require('./routes/characters.js')(app, database);
require('./routes/teams.js')(app, database, process.env.ADMIN_GOOGLE_ID);
//require('./routes/draftRoom.js')(app, database, io);
require('./routes/auth.js')(app, database, passport);

// Start the server
server.listen(3001, () => console.log("Backend Started On Port 3001"));