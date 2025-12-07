require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: Number(process.env.DB_MAX_CONNECTIONS) || 20,
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
});


async function initializedb() {
  try {
    console.log('DB initiliazation')
    const client = await pool.connect();
    client.release();

  } catch (err) {
    console.error('Error initializing PostgreSQL pool:', err);
  }
}

module.exports = { pool, initializedb };
