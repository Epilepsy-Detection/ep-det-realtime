const redisClient = require("../setup/redisClient");

module.exports.getDoctorSocketIdByPatient = async (patientSocketId) => {
  const client = redisClient.getInstance();
  const patientId = await client.HGET(`CONN:${patientSocketId}`, 'profileId');

  return await client.HGET(`DP_ASS:${patientId}`, "doctorSocketId");
}