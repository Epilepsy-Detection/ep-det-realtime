const redisClient = require("../setup/redisClient");

module.exports.removeDoctorAssociations = async (doctorId) => {

  const client = redisClient.getInstance();

  const results = await client.ft.search(
    'idx:assDoctorId',
    `@doctorId:"${doctorId}"`,
  );

  const deletePromises = results.documents.map(async (document) => {
    await client.del(document.id);
  });

  await Promise.all(deletePromises);

}