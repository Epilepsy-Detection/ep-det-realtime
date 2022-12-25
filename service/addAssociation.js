const redisClient = require("../setup/redisClient");

module.exports.addPatientDoctorAssociation = async (doctorSocketId, patientProfileId) => {

  const client = redisClient.getInstance();
  const doctorId = await client.hGet(`CONN:${doctorSocketId}`, 'profileId');

  const association = {
    doctorSocketId,
    doctorId
  }

  await client.hSet(`DP_ASS:${patientProfileId}`, association);
}