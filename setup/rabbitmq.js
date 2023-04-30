const amqp = require("amqplib");


let connection = null;
let channel = null;
module.exports.connect = async () => {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    console.info(`RabbitMQ Connected successfully!`.bgYellow);

  } catch (ex) {
    console.error(ex);
  }
}

module.exports.assertQueueCreated = async (queueName) => {
  try {
    await channel.assertQueue(queueName);
  } catch (e) {
    console.log("Failed to assert queue", queueName)
  }
}

module.exports.publishToQueue = async (queueName, data) => {
  try {
    channel.sendToQueue(queueName, data)
  } catch (err) {
    console.log("Failed to send  message to the queue", queueName)
  }
}

const disconnect = async () => {
    await channel.close();
    await connection.close();
}

process.on('exit', async (code) => {
  await disconnect();
})
