import app from './app.js';
import env from './config/index.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import logger from './utils/logger.js';

const startServer = async () => {
  try {
    try {
      await connectDatabase();
    } catch (dbError) {
      logger.warn(`Database unavailable: ${dbError.message}. Running with sample data APIs.`);
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 AAVRITTY API running on http://localhost:${env.PORT}`);
      logger.info(`📚 Swagger docs: http://localhost:${env.PORT}/api/docs`);
      logger.info(`❤️  Health check: http://localhost:${env.PORT}/api/v1/health`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
