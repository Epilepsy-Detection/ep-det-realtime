require('dotenv').config();
require('colors');

const express = require('express');
const http = require('http');
const setupDB = require('ep-det-core/startup-modules/db');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Setup Database
setupDB(console);

// Setup IO Server
require('./setup/ioServer')(server);

server.listen(PORT, () => {
    console.log(`real-time server listening on: ${PORT}`);
});