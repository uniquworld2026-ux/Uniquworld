const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

const runSqlFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  logger.info(`Running ${path.basename(filePath)}...`);
  await pool.query(sql);
  logger.info(`Completed ${path.basename(filePath)}`);
};

const migrate = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (!files.length) {
    logger.warn('No migration files found');
    return;
  }

  for (const file of files) {
    await runSqlFile(path.join(migrationsDir, file));
  }
};

migrate()
  .then(async () => {
    logger.info('Migrations finished successfully');
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    logger.error('Migration failed', { message: error.message, stack: error.stack });
    await pool.end();
    process.exit(1);
  });
