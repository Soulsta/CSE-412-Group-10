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

// Get all events with ticket availability, optional sort + category filter
app.get('/api/events', async (req, res) => {
  const { sort, category } = req.query;
  const sortDir = String(sort).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const params = [];
  let whereClause = '';
  if (category) {
    params.push(category);
    whereClause = `WHERE e.categorytype = $${params.length}`;
  }

  try {
    const result = await pool.query(
      `SELECT e.eventid, e.eventlocation, e.eventtime, e.releasestart, e.releaseend,
              e.capacity, e.maxticketsperstudent, e.status, e.categorytype, e.staffid,
              COUNT(t.ticketid) AS ticketsclaimed,
              e.capacity - COUNT(t.ticketid) AS ticketsremaining
       FROM events e
       LEFT JOIN ticket t ON e.eventid = t.eventid
       ${whereClause}
       GROUP BY e.eventid
       ORDER BY e.eventtime ${sortDir}`,
      params
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create a new event
app.post('/api/admin/events', async (req, res) => {
  const {
    eventLocation, eventTime, releaseStart, releaseEnd,
    capacity, maxTicketsPerStudent, status, categoryType, staffId
  } = req.body;

  try {
    const idResult = await pool.query('SELECT COALESCE(MAX(eventid), 0) + 1 AS nextid FROM events');
    const eventId = idResult.rows[0].nextid;

    const result = await pool.query(
      `INSERT INTO events (eventid, eventlocation, eventtime, releasestart, releaseend,
                           capacity, maxticketsperstudent, status, categorytype, staffid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [eventId, eventLocation, eventTime, releaseStart, releaseEnd,
       capacity, maxTicketsPerStudent, status, categoryType, staffId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update an event
app.put('/api/admin/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const fieldMap = {
    eventLocation: 'eventlocation',
    eventTime: 'eventtime',
    releaseStart: 'releasestart',
    releaseEnd: 'releaseend',
    capacity: 'capacity',
    status: 'status',
  };

  const setClauses = [];
  const params = [];
  for (const [key, column] of Object.entries(fieldMap)) {
    if (req.body[key] !== undefined) {
      params.push(req.body[key]);
      setClauses.push(`${column} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ message: 'No fields provided to update.' });
  }

  params.push(eventId);

  try {
    const result = await pool.query(
      `UPDATE events SET ${setClauses.join(', ')} WHERE eventid = $${params.length} RETURNING *`,
      params
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete an event
app.delete('/api/admin/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM events WHERE eventid = $1',
      [eventId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    return res.json({ message: 'Event deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Claim a ticket
app.post('/api/tickets', async (req, res) => {
  const { eventId, asurite } = req.body;

  if (!eventId || !asurite) {
    return res.status(400).json({ message: 'eventId and asurite are required.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const studentResult = await client.query(
      'SELECT eligible FROM student WHERE asurite = $1',
      [asurite]
    );
    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Student not found.' });
    }
    if (!studentResult.rows[0].eligible) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Student is not eligible.' });
    }

    const eventResult = await client.query(
      `SELECT e.status, e.releasestart, e.releaseend, e.capacity,
              COUNT(t.ticketid) AS ticketsclaimed
       FROM events e LEFT JOIN ticket t ON e.eventid = t.eventid
       WHERE e.eventid = $1
       GROUP BY e.eventid`,
      [eventId]
    );
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Event not found.' });
    }

    const event = eventResult.rows[0];
    if (event.status !== 'Scheduled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Event is not open for ticket claims.' });
    }

    const now = new Date();
    if (now < new Date(event.releasestart) || now > new Date(event.releaseend)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Release window is not open.' });
    }

    if (Number(event.ticketsclaimed) >= event.capacity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'No tickets remaining.' });
    }

    const existing = await client.query(
      'SELECT ticketid FROM ticket WHERE eventid = $1 AND asurite = $2',
      [eventId, asurite]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Student already has a ticket for this event.' });
    }

    const idResult = await client.query('SELECT COALESCE(MAX(ticketid), 0) + 1 AS nextid FROM ticket');
    const ticketId = idResult.rows[0].nextid;

    const insertResult = await client.query(
      'INSERT INTO ticket (ticketid, eventid, asurite) VALUES ($1, $2, $3) RETURNING *',
      [ticketId, eventId, asurite]
    );

    await client.query('COMMIT');
    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  } finally {
    client.release();
  }
});

// Return/unclaim a ticket
app.delete('/api/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM ticket WHERE ticketid = $1',
      [ticketId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    return res.json({ message: 'Ticket returned.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all tickets for a student
app.get('/api/tickets/:asurite', async (req, res) => {
  const { asurite } = req.params;

  try {
    const result = await pool.query(
      `SELECT t.ticketid, t.eventid, t.asurite,
              e.eventlocation, e.eventtime, e.categorytype, e.status
       FROM ticket t
       JOIN events e ON t.eventid = e.eventid
       WHERE t.asurite = $1
       ORDER BY e.eventtime ASC`,
      [asurite]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));