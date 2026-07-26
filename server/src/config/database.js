const { Pool } = require('pg');
const config = require('./index');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: config.db.connectionString,
  ssl: config.db.ssl,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
  connectionTimeoutMillis: config.db.connectionTimeoutMillis,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL pool error', { message: err.message });
});

/**
 * Execute a parameterized query.
 * @param {string} text
 * @param {unknown[]} [params]
 */
const query = async (text, params = []) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (config.env === 'development') {
    logger.debug('DB query', { duration, rows: result.rowCount });
  }

  return result;
};

/**
 * Get a client for transactions.
 */
const getClient = async () => pool.connect();

/**
 * Run work inside a transaction.
 * @param {(client: import('pg').PoolClient) => Promise<T>} callback
 * @returns {Promise<T>}
 * @template T
 */
const withTransaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const healthCheck = async () => {
  const result = await query('SELECT NOW() AS now');
  return result.rows[0];
};

module.exports = {
  pool,
  query,
  getClient,
  withTransaction,
  healthCheck,
};
