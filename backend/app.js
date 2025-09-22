// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const path = require("path");
const database = require('./database.js');
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
server.listen(PORT, () => console.log(`Backend Started On Port ${PORT}`));

// Setup CORS based on environment
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.HEROKU_APP_URL || 'https://unite-pro-0d311a8552a3.herokuapp.com'] 
  : ['http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true // Important for cookies/sessions with OAuth
}));

// Add middleware to parse JSON bodies
app.use(express.json());
// Add middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// session store and session config
app.use(
  session({
    store: new (require('memorystore')(session))(),
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000 * 60 * 2,
    },
  }),
);

// Initialize passport and session - MUST be after session middleware but before routes
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

// Serve static files from the React frontend app in production
if (process.env.NODE_ENV === 'production') {
  console.log('Serving static files from:', path.join(__dirname, 'public'));
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'public')));
}

app.get('/ping', (req, res) => {
  console.log("backend hit");
  res.json({message: 'Pong'});
});

// app.use(express.static(
//   path.resolve(__dirname, "public")
// ));

// Socket.IO connection handler
require('./socket/socketManager')(io);

// Routes - load AFTER all middleware is set up
require('./routes/characters.js')(app, database, process.env.ADMIN_GOOGLE_ID);
require('./routes/teams.js')(app, database, process.env.ADMIN_GOOGLE_ID);
require('./routes/comps.js')(app, database, process.env.ADMIN_GOOGLE_ID);
require('./routes/draftRoom.js')(app, database, io);
require('./routes/auth.js')(app, database, passport, process.env.NODE_ENV, process.env.HEROKU_APP_URL);

// Serve the frontend build
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_, res) => res.sendFile('index.html', {root: '../frontend/build'}));
}