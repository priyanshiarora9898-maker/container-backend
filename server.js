console.log('ENV PATH:', __dirname + '/../../.env');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const { initializedb } = require('./config/db/db.js');
const errorHandler =require('./middleware/errorHandler');
const containerRoutes = require('./routes/container');

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);

async function startServer() {
  try {
    await initializedb(); // wait for pool initialization
    const PORT = process.env.PORT || 5000;
    app.use('/containers', containerRoutes);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize DB pool:', err);
  }
}

startServer();