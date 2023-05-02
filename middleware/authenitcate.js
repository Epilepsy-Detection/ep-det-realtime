const AppError = require("ep-det-core/utils/AppError");
const { verifyJWTToken } = require("ep-det-core/utils/verifyJWT");
const { addNewConnection } = require("../service/redis/addNewConnection");

module.exports = async (socket, next) => {
  try {
    const auth = socket.handshake.auth;

    if (auth && auth.token) {
      const token = auth.token;
      const decoded = verifyJWTToken(token);

      socket.user = decoded;

      await addNewConnection(socket.id, decoded);

      next();
      
    } else {
      throw new AppError("Missing access token", 401);
    }
  } catch (err) {
    next(err);
  }
};
