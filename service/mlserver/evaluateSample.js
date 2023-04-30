const axios = require('axios');

module.exports.evaluateSample = async (sample) => {
  const arr = [...sample]
  axios.post('http://localhost:2000/predict', {data: arr})
    .then(res => {
      const prediction = res.data.prediction;

      const label = prediction.label
      if (label === "A" || label === "B") {
        // TODO: Notify Emergency Contact
        console.log("Epileptic", label)
      } else {
        console.log("Non Epileptic", label)
      }
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
}