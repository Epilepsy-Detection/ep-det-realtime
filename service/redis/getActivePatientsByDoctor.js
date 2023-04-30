const redisClient = require("../../setup/redisClient");
const Patient = require('ep-det-core/models/mongoose/patient')

module.exports.getActivePatientsByDoctor = async (doctorSocketId) => {

  const client = redisClient.getInstance();
  const doctorId = await client.hGet(`CONN:${doctorSocketId}`, 'profileId');

  const patients = await Patient.find({ _doctorId: doctorId });

  if (!patients || patients.length === 0) return [];

  const patientsIds = patients.map(patient => patient._id.toString());
  const searchString = patientsIds.join(" | ");

  const results = await client.ft.search(
    'idx:connProfileId',
    searchString
  );

  const ids = results.documents.map((document) => document.value["profileId"]);

  return ids;


}