const express = require('express');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  // your db config here
  user: 'vansh',
  host: 'localhost',
  database: 'login',
  password: '2004',
  port: 5432,
});

let currAccountId = 0;
// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const {email,password,name,phone,role} = req.body;

  try {
    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    

   // const RoleID=await pool.query('SELECT "RoleID" FROM "Role" WHERE name= $1', [role]);
    // Save user with hashed password
    await pool.query(
      'INSERT INTO users (email, password_hash,name,phone,role) VALUES ($1,$2,$3,$4,$5)',
      [email,hashedPassword,name,phone,role]
    );

    res.status(201).json({ message: 'User registered successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If successful, send back user info or token for session
    currAccountId = user.id;
    res.json({ name: user.name, id: user.id,testID: currAccountId });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});


app.get('/api/user', async (req, res) => {
  try {

    //Find user to the corresponding id
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [currAccountId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user ID',TestID: currAccountId });
    }
    const user = result.rows[0];

    // Send back user info
    res.json({ name: user.name, email: user.email, phone: user.phone, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/user/volunteer', async (req, res) => {
  try {

    //Find user to the corresponding id
    const result = await pool.query("SELECT * FROM users WHERE role = 'Volunteer'");

    const VolunteerCount = result.rows.length;

    // Send back user info
    res.json({ volunteerCount: VolunteerCount });
  } catch (err) {
    res.status(500).json({ error:'fetch issue' });
  }
});


app.listen(5000, () => console.log('Server running on port 5000'));

