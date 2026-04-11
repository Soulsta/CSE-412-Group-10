require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Student login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT asurite, email, password FROM student WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({ message: 'Login successful.', asurite: user.asurite, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT staffid, staffemail, staffpassword, staffrole FROM athleticadministrator WHERE staffemail = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const admin = result.rows[0];

    if (password !== admin.staffpassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({ message: 'Login successful.', staffId: admin.staffid, email: admin.staffemail, role: admin.staffrole });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Student registration
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const existing = await pool.query(
      'SELECT email FROM student WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const asurite = email.split('@')[0];

    await pool.query(
      'INSERT INTO student (asurite, password, email, eligible) VALUES ($1, $2, $3, $4)',
      [asurite, password, email, true]
    );

    return res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'ASURITE already taken.' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all students
app.get('/api/admin/students', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT asurite, email, eligible FROM student ORDER BY asurite'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete a student by asurite
app.delete('/api/admin/students/:asurite', async (req, res) => {
  const { asurite } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM student WHERE asurite = $1',
      [asurite]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    return res.json({ message: 'Student deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//this is how we get the events from our database so taht we can use them in the frontend
app.get('/events', async (req, res) => {
  try {
    //below is where we execute our SQL query which retrieves the events and their attributes
    //Note that some attributes are not there as students should not be able to see every attribute
    const result = await pool.query(`
      SELECT 
        eventid,
        eventlocation,
        eventtime,
        releasestart,
        releaseend,
        maxticketsperstudent,
        status,
        categorytype
      FROM events
      ORDER BY eventtime ASC
    `);
    //then we send our response as json
    res.json(result.rows);
  }
  //if there are any errors then we display it
  catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});