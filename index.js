
import { server } from "./src/server.js";
import { openDbConnection } from "./src/db.js";
import logger from "./src/utils/logger.js";

openDbConnection()
  .then(() => {
    logger.info('Database connected successfully');
    return server.start();
  })
  .catch((error) => logger.error("failed to start server", error.message));
