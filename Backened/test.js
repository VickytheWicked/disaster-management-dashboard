const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'vansh',        // PostgreSQL username
  host: 'localhost',       // Typically 'localhost'
  database: 'login',      // The database you just created
  password: '2004',// The password you set
  port: 5432               // Default PostgreSQL port
});

// Test route to be sure DB is connected
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Express server running'));

