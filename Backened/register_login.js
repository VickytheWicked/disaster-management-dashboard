const express = require('express');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Create a new database file if it doesn't exist
const db = new sqlite3.Database('./disaster_relief.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the disaster_relief database.');
});

// Create users table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT,
    phone TEXT,
    role TEXT,
    location TEXT,
    created_at TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    quantity INTEGER,
    unit TEXT,
    location TEXT,
    category TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    message TEXT,
    status TEXT,
    timestamp TEXT,
    type TEXT,
    recipient TEXT,
    sender TEXT
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });



  db.run(`CREATE TABLE IF NOT EXISTS teams (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_name TEXT,
    leader_id INT,
    FOREIGN KEY (leader_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS team_members (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT,
    team_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  // Seed the database with some data for demonstration
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row.count === 0) {
        const saltRounds = 10;
        bcrypt.hash('password', saltRounds, (err, hashedPassword) => {
            if (err) return;
            db.run("INSERT INTO users (id, name, email, password_hash, phone, role, location) VALUES (1, 'John Doe', 'john@example.com', ?, '111-222-3333', 'Volunteer', 'Warehouse A')", [hashedPassword]);
            db.run("INSERT INTO users (id, name, email, password_hash, phone, role, location) VALUES (2, 'Jane Smith', 'jane@example.com', ?, '444-555-6666', 'Warehouse Manager', 'Warehouse B')", [hashedPassword]);
            db.run("INSERT INTO users (id, name, email, password_hash, phone, role, location) VALUES (3, 'Peter Jones', 'peter@example.com', ?, '777-888-9999', 'Volunteer', 'Warehouse A')", [hashedPassword]);
            db.run("INSERT INTO users (id, name, email, password_hash, phone, role, location) VALUES (4, 'Admin User', 'admin@example.com', ?, '000-000-0000', 'Admin', 'HQ')", [hashedPassword]);
            console.log("Database seeded with initial user data.");

            db.get("SELECT COUNT(*) as count FROM teams", (err, row) => {
              if (row.count === 0) {
                db.run("INSERT INTO teams (id, team_name, leader_id) VALUES (101, 'Alpha Team', 4)");
                db.run("INSERT INTO teams (id, team_name, leader_id) VALUES (102, 'Beta Team', 2)");
          
                db.run("INSERT INTO team_members (user_id, team_id) VALUES (1, 101)");
                db.run("INSERT INTO team_members (user_id, team_id) VALUES (3, 101)");
                db.run("INSERT INTO team_members (user_id, team_id) VALUES (2, 102)");
                console.log("Database seeded with initial team data.");
              }
            });
        });
    }
  });
});

// API endpoints for alerts
app.get('/api/alerts', (req, res) => {
  db.all('SELECT * FROM alerts ORDER BY timestamp DESC', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.post('/api/alerts', (req, res) => {
  const { title, message, status, type, recipient, sender } = req.body;
  const timestamp = new Date().toISOString();
  db.run(
    'INSERT INTO alerts (title, message, status, timestamp, type, recipient, sender) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, message, status, timestamp, type, recipient, sender],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});


// API endpoints for resources
app.get('/api/resources', (req, res) => {
  db.all('SELECT * FROM resources', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.post('/api/resources', (req, res) => {
  const { name, quantity, unit, location, category } = req.body;
  db.run(
    'INSERT INTO resources (name, quantity, unit, location, category) VALUES (?, ?, ?, ?, ?)',
    [name, quantity, unit, location, category],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/api/resources/:id', (req, res) => {
  const { name, quantity, unit, location, category } = req.body;
  db.run(
    'UPDATE resources SET name = ?, quantity = ?, unit = ?, location = ?, category = ? WHERE id = ?',
    [name, quantity, unit, location, category, req.params.id],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/api/resources/:id', (req, res) => {
  db.run('DELETE FROM resources WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ changes: this.changes });
  });
});


let currAccountId = 0;
// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, role } = req.body;

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error during registration' });
      }
      if (row) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const createdAt = new Date().toISOString();

      // Save user with hashed password
      db.run(
        'INSERT INTO users (email, password_hash,name,phone,role, created_at) VALUES (?,?,?,?,?,?)',
        [email, hashedPassword, name, phone, role, createdAt],
        (err) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Server error during registration' });
          }
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error during login' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // If successful, send back user info or token for session
      currAccountId = user.id;
      res.json({ name: user.name, id: user.id, testID: currAccountId });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});


app.get('/api/user', async (req, res) => {
  try {

    //Find user to the corresponding id
    db.get('SELECT * FROM users WHERE id = ?', [currAccountId], (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error during login' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid user ID', TestID: currAccountId });
      }

      // Send back user info
      res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, location: user.location });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.put('/api/user', async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    db.run(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, currAccountId],
      function(err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Server error' });
        }
        res.json({ changes: this.changes });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    db.get('SELECT * FROM users WHERE id = ?', [currAccountId], async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid user ID' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid current password' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      db.run(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        [hashedPassword, currAccountId],
        function(err) {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Server error' });
          }
          res.json({ changes: this.changes });
        }
      );
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users', (req, res) => {
  db.all('SELECT id, name, email, phone, role FROM users', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, phone, role } = req.body;
  db.run(
    'UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE id = ?',
    [name, email, phone, role, req.params.id],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ changes: this.changes });
  });
});

app.get('/api/analytics/resources', (req, res) => {
  db.all('SELECT category, SUM(quantity) as quantity FROM resources GROUP BY category', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.get('/api/analytics/alerts', (req, res) => {
  db.all("SELECT strftime('%Y-%m-%d', timestamp) as date, COUNT(*) as count FROM alerts GROUP BY date ORDER BY date", (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.get('/api/analytics/volunteers', (req, res) => {
  db.all("SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count FROM users WHERE role = 'Volunteer' GROUP BY date ORDER BY date", (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.get('/api/user/volunteer', async (req, res) => {
  try {

    //Find user to the corresponding id
    db.all("SELECT * FROM users WHERE role = 'Volunteer'", (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'fetch issue' });
      }
      const VolunteerCount = rows.length;

      // Send back user info
      res.json({ volunteerCount: VolunteerCount });
    });
  } catch (err) {
    res.status(500).json({ error: 'fetch issue' });
  }
});

app.get('/api/volunteers', (req, res) => {
  db.all("SELECT id, name, email, phone, role, location FROM users WHERE role = 'Volunteer'", (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.get('/api/team/volunteer/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the team for the volunteer
    db.get('SELECT team_id FROM team_members WHERE user_id = ?', [userId], (err, teamMember) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      if (!teamMember) {
        return res.status(404).json({ error: 'Volunteer not found in any team' });
      }

      const { team_id } = teamMember;

      // Get team details
      db.get('SELECT team_name, leader_id FROM teams WHERE id = ?', [team_id], (err, team) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Server error' });
        }
        if (!team) {
          return res.status(404).json({ error: 'Team not found' });
        }

        const { team_name, leader_id } = team;

        // Get leader's name
        db.get('SELECT name FROM users WHERE id = ?', [leader_id], (err, leader) => {
          if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Server error' });
          }

          const leaderName = leader ? leader.name : 'N/A';

          // Get team members
          db.all('SELECT user_id FROM team_members WHERE team_id = ?', [team_id], (err, members) => {
            if (err) {
              console.error(err.message);
              return res.status(500).json({ error: 'Server error' });
            }

            const memberIds = members.map(m => m.user_id);

            // Get member names
            db.all(`SELECT name FROM users WHERE id IN (${memberIds.join(',')})`, (err, memberNames) => {
              if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Server error' });
              }

              res.json({
                teamName: team_name,
                leaderName: leaderName,
                members: memberNames.map(m => m.name),
              });
            });
          });
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/teams', (req, res) => {
  db.all('SELECT id, team_name FROM teams', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(rows);
  });
});

app.post('/api/teams/assign', (req, res) => {
  const { userId, teamId } = req.body;

  db.get('SELECT * FROM team_members WHERE user_id = ?', [userId], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }

    if (row) {
      // Update existing entry
      db.run('UPDATE team_members SET team_id = ? WHERE user_id = ?', [teamId, userId], function(err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Server error' });
        }
        res.json({ message: 'Team assignment updated successfully' });
      });
    } else {
      // Insert new entry
      db.run('INSERT INTO team_members (user_id, team_id) VALUES (?, ?)', [userId, teamId], function(err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'User assigned to team successfully' });
      });
    }
  });
});


app.listen(5000, () => console.log('Server running on port 5000'));

