const { pool } = require('./db');
class Transaction {
  constructor() {
    this.pool = pool;
    this.client = null;
    this.inTransaction = false;
  }

  async begin() {
    this.client = await this.pool.connect();
    try {
      await this.client.query('BEGIN');
      this.inTransaction = true;
    } catch (err) {
      this.client.release();
      throw err;
    }
  }

  async query(text, params) {
    if (!this.inTransaction) throw new Error('Transaction not started. Call begin() first.');
    return this.client.query(text, params);
  }

  async commit() {
    if (!this.inTransaction) return;
    try {
      await this.client.query('COMMIT');
    } finally {
      this.inTransaction = false;
      this.client.release();
    }
  }

  async rollback() {
    if (!this.inTransaction) return;
    try {
      await this.client.query('ROLLBACK');
    } finally {
      this.inTransaction = false;
      this.client.release();
    }
  }
}

module.exports = Transaction;
