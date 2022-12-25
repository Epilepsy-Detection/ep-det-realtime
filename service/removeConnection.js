const redisClient = require("../setup/redisClient");

module.exports.removeConnection = async (socketId) => {

  const key = `CONN:${socketId}`;
  const client = await redisClient.getInstance();

  const connection = await client.hGetAll(key)
  await client.del(`CONN:${socketId}`);

  return connection;
}