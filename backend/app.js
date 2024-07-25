const express = require("express");
const path = require("path");
const database = require('./database.js');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require("cors");

const app = express();

app.use(cors());

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

app.listen(3001, () => console.log("Backend Started On Port 3001"));

require('./routes/characters.js')(app, database);
require('./routes/teams.js')(app, database);