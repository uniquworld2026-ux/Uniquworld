const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const { pool } = require('./config/database');

const server = app.listen(config.port, () => {
  logger.info(`${config.appName} API listening on port ${config.port} [${config.env}]`);
  logger.info(`Swagger docs: ${config.appUrl}/api/docs`);
});

const shutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    try {
      await pool.end();
      logger.info('PostgreSQL pool closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', { message: error.message });
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason: String(reason) });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { message: error.message, stack: error.stack });
  process.exit(1);
});
