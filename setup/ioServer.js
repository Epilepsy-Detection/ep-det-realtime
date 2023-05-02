const { Server } = require("socket.io");

const socketLog = require("./socketConsoleLog");
const authenticate = require("../middleware/authenitcate");
const { removeConnection } = require("../service/redis/removeConnection");
const { addPatientDoctorAssociation } = require("../service/redis/addAssociation");
const { getDoctorSocketIdByPatient } = require("../service/redis/hasAssociation");
const {
  getActivePatientsByDoctor,
} = require("../service/redis/getActivePatientsByDoctor");
const {
  removeDoctorAssociations,
} = require("../service/redis/removeDoctorAssociations");
const redisClient = require("./redisClient");
const { evaluateSample } = require("../service/mlserver/evaluateSample");

let io;

module.exports = async (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  await redisClient.setup();

  io.use(authenticate).on("connection", async (socket) => {
    socketLog(
      `New Connection - profileId:  ${socket.user._profileId} - role: ${socket.user.role}`
    );

    socket.on("new-eeg-batch-message", async (data) => {
      const doctorSocketId = await getDoctorSocketIdByPatient(socket.id);

      if (doctorSocketId) {
        io.to(doctorSocketId).emit("new-patient-message", data);
      }

      evaluateSample(data, socket.user._profileId)
    });

    socket.on("associate_patient", async (patientId) => {
      await addPatientDoctorAssociation(socket.id, patientId);
    });

    socket.on("get_active_patients", async () => {
      const patients = await getActivePatientsByDoctor(socket.id);
      io.to(socket.id).emit("active_patients_result", patients);
    });

    socket.on("disconnect", async () => {
      const connection = await removeConnection(socket.id);

      if (connection.role === "doctor") {
        await removeDoctorAssociations(connection.profileId);
      }

      socketLog(`Socket Disconnected - profileId:  ${socket.user._profileId}`);
    });
  });

  console.log(`Socket.IO Setup successfully!`.yellow);
};
