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

  //check to see if user entered email and password, if not then send error msg
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    //otherwise try to log in and select from db to log user in
    const result = await pool.query(
      'SELECT asurite, email, password FROM student WHERE email = $1',
      [email]
    );

    //if password is not in the db then we throw error to user
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    //display successful login msg to user
    return res.json({ message: 'Login successful.', asurite: user.asurite, email: user.email });
  } catch (err) {
    //throw error if login unsuccessful
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  //first grab email and password
  const { email, password } = req.body;
  //check for email and passsword and display msg if not entered
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  //select the user from the database with email and password
  try {
    const result = await pool.query(
      'SELECT staffid, staffemail, staffpassword, staffrole FROM athleticadministrator WHERE staffemail = $1',
      [email]
    );
    //if email or password incorrect we throw an error msg
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const admin = result.rows[0];
    //if password incorrect throw error
    if (password !== admin.staffpassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    //display successful login msg
    return res.json({ message: 'Login successful.', staffId: admin.staffid, email: admin.staffemail, role: admin.staffrole });
  } catch (err) {
    //throw error if server error
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Student registration
app.post('/api/register', async (req, res) => {
  //get email and password
  const { email, password } = req.body;

  //throw msg if incorrect email/password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  //select the email from user
  try {
    const existing = await pool.query(
      'SELECT email FROM student WHERE email = $1',
      [email]
    );

    //throw error if email already exists
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    //split the email at the @ so we can parse for asurite
    const asurite = email.split('@')[0];

    //insert the user into the database with asurite, email. password and eligible set to true
    await pool.query(
      'INSERT INTO student (asurite, password, email, eligible) VALUES ($1, $2, $3, $4)',
      [asurite, password, email, true]
    );
    //display user created successfully
    return res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    //throw error if asurite already exiss
    if (err.code === '23505') {
      return res.status(409).json({ message: 'ASURITE already taken.' });
    }
    //throw server error
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all students
app.get('/api/admin/students', async (req, res) => {
  try {
    //select all of the students and order by asurite to display
    const result = await pool.query(
      'SELECT asurite, email, eligible FROM student ORDER BY asurite'
    );
    //return all of the users ordered by asurite
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    //throw error if problem
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete a student by asurite
app.delete('/api/admin/students/:asurite', async (req, res) => {
  //get asurite
  const { asurite } = req.params;

  try {
    //delete the user from the database using asurite
    const result = await pool.query(
      'DELETE FROM student WHERE asurite = $1',
      [asurite]
    );

    //if student not found throw error
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    //msg that student has been successfully deleted
    return res.json({ message: 'Student deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get all events with ticket availability, optional sort + category filter
app.get('/api/events', async (req, res) => {
  //get category and sort
  const { sort, category } = req.query;
  const sortDir = String(sort).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const params = [];
  let whereClause = '';
  if (category) {
    //set up the where clause based on params
    params.push(category);
    whereClause = `WHERE e.categorytype = $${params.length}`;
  }

  try {
    //select event information and connect it with the where clause created above 
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
    //The where clause above is based on user selected sort and category
    //display the resulting events
    return res.json(result.rows);
  } catch (err) {
    //throw error if needed
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create a new event
app.post('/api/admin/events', async (req, res) => {
  //fill the features with the corresponding infomration collected from the user
  const {
    eventLocation, eventTime, releaseStart, releaseEnd,
    capacity, maxTicketsPerStudent, status, categoryType, staffId
  } = req.body;

  try {
    const idResult = await pool.query('SELECT COALESCE(MAX(eventid), 0) + 1 AS nextid FROM events');
    const eventId = idResult.rows[0].nextid;
    //insert the event into the database using collected information from user
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
  //get event ID so we know which event to update
  const { eventId } = req.params;
  //get updated information
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
  //add the updated information to the database
  for (const [key, column] of Object.entries(fieldMap)) {
    if (req.body[key] !== undefined) {
      params.push(req.body[key]);
      setClauses.push(`${column} = $${params.length}`);
    }
  }
  //throw error if nothing was entered to update
  if (setClauses.length === 0) {
    return res.status(400).json({ message: 'No fields provided to update.' });
  }

  params.push(eventId);
//now we use SQL query to update the corresponding event based on eventID
  try {
    const result = await pool.query(
      `UPDATE events SET ${setClauses.join(', ')} WHERE eventid = $${params.length} RETURNING *`,
      params
    );
    //throw error if event not found
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    //throw error if server error
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete an event
app.delete('/api/admin/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    //delete event from the database using DELETE SQL and eventID
    const result = await pool.query(
      'DELETE FROM events WHERE eventid = $1',
      [eventId]
    );
    //throw error if event not found
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    //event deleted successfully
    return res.json({ message: 'Event deleted.' });
  } catch (err) {
    console.error(err);
    //throw server error
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Claim a ticket
app.post('/api/tickets', async (req, res) => {
  //get eventid and asurite
  const { eventId, asurite } = req.body;
  //check to ensure both are there otherwise throw error
  if (!eventId || !asurite) {
    return res.status(400).json({ message: 'eventId and asurite are required.' });
  }

  const client = await pool.connect();
  try {
    //start our begin query
    await client.query('BEGIN');
    //select the student based on asurite
    const studentResult = await client.query(
      'SELECT eligible FROM student WHERE asurite = $1',
      [asurite]
    );
    //if student is not found then we rollback the database no change made
    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Student not found.' });
    }
    //if student has already claimed a ticket then they are not eligable so throw error and rollback
    if (!studentResult.rows[0].eligible) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Student is not eligible.' });
    }
    //otherwise we select the event 
    const eventResult = await client.query(
      `SELECT e.status, e.releasestart, e.releaseend, e.capacity,
              COUNT(t.ticketid) AS ticketsclaimed
       FROM events e LEFT JOIN ticket t ON e.eventid = t.eventid
       WHERE e.eventid = $1
       GROUP BY e.eventid`,
      [eventId]
    );
    //check to ensure event has been found otherwise we rollback
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Event not found.' });
    }

    //if event is not scheduled then we cannot claim tickets yet so throw error and rollback
    const event = eventResult.rows[0];
    if (event.status !== 'Scheduled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Event is not open for ticket claims.' });
    }

    const now = new Date();
    //if event is not released yet or passed then we throw error and rollback
    if (now < new Date(event.releasestart) || now > new Date(event.releaseend)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Release window is not open.' });
    }

    //get number of tickets and ensure there is room or not
    if (Number(event.ticketsclaimed) >= event.capacity) {
      //if no room left then we rollbakc and throw error
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'No tickets remaining.' });
    }

    //select the ticketid based on eventid and asurite
    const existing = await client.query(
      'SELECT ticketid FROM ticket WHERE eventid = $1 AND asurite = $2',
      [eventId, asurite]
    );
    //if a student already has a ticket then we rollback and throw error
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Student already has a ticket for this event.' });
    }
    //mark that the student has claimed a ticket so they cannot claim another
    const idResult = await client.query('SELECT COALESCE(MAX(ticketid), 0) + 1 AS nextid FROM ticket');
    const ticketId = idResult.rows[0].nextid;

    //insert the ticketid and eventid and asurite in ticket
    const insertResult = await client.query(
      'INSERT INTO ticket (ticketid, eventid, asurite) VALUES ($1, $2, $3) RETURNING *',
      [ticketId, eventId, asurite]
    );

    //commit the sql queries to mark a completed transactions
    await client.query('COMMIT');
    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    //rollback if we get error
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
    //to return a ticket we delete using the ticketid
    const result = await pool.query(
      'DELETE FROM ticket WHERE ticketid = $1',
      [ticketId]
    );
    //if student tries to return ticket but never claimed one we throw error
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }
    //successfully returned a ticket
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
    //select all of the tickets for the event using event id and join with asurite and eventtime
    const result = await pool.query(
      `SELECT t.ticketid, t.eventid, t.asurite,
              e.eventlocation, e.eventtime, e.categorytype, e.status
       FROM ticket t
       JOIN events e ON t.eventid = e.eventid
       WHERE t.asurite = $1
       ORDER BY e.eventtime ASC`,
      [asurite]
    );
    //display result
    return res.json(result.rows);
  } catch (err) {
    //throw error if needed
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));