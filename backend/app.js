const express = require("express");
const path = require("path");
const database = require('./database.js');

const app = express();

app.use(express.static(
  path.resolve(__dirname, "public")
));

app.listen(3000, () => console.log("Backend Started"));

require('./routes/characters.js')(app, database);
require('./routes/teams.js')(app, database);