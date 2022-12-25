const redisClient = require("../setup/redisClient");

module.exports.addNewConnection = async (socketId, user) => {
    const connection = {
        userId: user._id,
        profileId: user._profileId,
        role: user.role
    }

    const client = redisClient.getInstance();
    await client.HSET(`CONN:${socketId}`, connection);
}
