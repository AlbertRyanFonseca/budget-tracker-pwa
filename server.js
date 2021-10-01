const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const { connected } = require('./config/connection');
const compression = require("compression");
require('dotenv').config();

const PORT = process.env.PORT || 3001;
connected();

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected');
})
// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});