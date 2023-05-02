require('dotenv').config();
require('colors');

const express = require('express');
const http = require('http');
const setupDB = require('ep-det-core/startup-modules/db');

const rabbitmq = require('./setup/rabbitmq');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Setup Database
setupDB(console);

// Setup RabbitMQ
(async () => {
    await rabbitmq.connect();
    await rabbitmq.assertQueueCreated("EmergencyContactNotifier")
})();

// Setup IO Server
require('./setup/ioServer')(server);

server.listen(PORT, () => {
    console.log(`real-time server listening on: ${PORT}`);
});