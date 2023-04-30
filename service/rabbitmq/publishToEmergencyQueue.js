const { publishToQueue } = require("../../setup/rabbitmq");

const EMERGENCY_QUEUE_NAME = "EmergencyContactNotifier";

module.exports.publishToEmergencyQueue = async (data) => {
  const msgBuffer = Buffer.from(JSON.stringify(data));
  await publishToQueue(EMERGENCY_QUEUE_NAME, msgBuffer)
}