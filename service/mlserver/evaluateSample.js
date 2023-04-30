const axios = require('axios');
const { publishToEmergencyQueue } = require("../rabbitmq/publishToEmergencyQueue");

module.exports.evaluateSample = async (sample, patientId) => {
  const arr = [...sample]
  axios.post('http://localhost:2000/predict', {data: arr})
    .then((res) => {
      const prediction = res.data.prediction;

      const label = prediction.label
      if (label === "A" || label === "B") {
        const data = {
          label: prediction.label,
          patientId: patientId,
        }
        publishToEmergencyQueue(data)
      }
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
}