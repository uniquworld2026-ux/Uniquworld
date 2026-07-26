const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

const runSqlFile = async (filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  logger.info(`Seeding ${path.basename(filePath)}...`);
  await pool.query(sql);
  logger.info(`Completed ${path.basename(filePath)}`);
};

const seed = async () => {
  const seedsDir = path.join(__dirname, 'seeds');
  const files = fs
    .readdirSync(seedsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    await runSqlFile(path.join(seedsDir, file));
  }
};

seed()
  .then(async () => {
    logger.info('Seeds finished successfully');
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    logger.error('Seed failed', { message: error.message, stack: error.stack });
    await pool.end();
    process.exit(1);
  });
