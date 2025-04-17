const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();  // To load environment variables

const app = express();
const port = process.env.PORT || 5000;


// Enable CORS
app.use(cors());
app.use(express.json());  // To parse JSON request bodies

// PostgreSQL client setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Required for Render-hosted DBs
  },
});


pool.connect((err,client,release) => {
    if (err) {
        console.error('Failed to connect to the database:', err.stack);
    } else {
        console.log('Connected to the database successfully!');
        release(); // Release the client back to the pool
    }
});
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character' 
    });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await pool.query(
      'INSERT INTO "SignUp/SignIn" (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Look for user
    const result = await pool.query('SELECT * FROM "SignUp/SignIn" WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Sign in successful!' });

  } catch (err) {
    console.error('Signin error:', err.message);
    res.status(500).json({ error: 'Error signing in' });
  }
});

// API to get contacts
app.get('/contacts', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM "ContactList"');
      console.log("Fetched rows:", result.rows);  // Add this line
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error running query:", err); // Better error logging
      res.status(500).send('Error fetching contacts');
    }
  });
  app.post('/contacts', async (req, res) => {
    const { companyName, companyEmail, companyPhone, companyAddress } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO "ContactList" ("companyName", "companyEmail", "companyPhone", "companyAddress") VALUES ($1, $2, $3, $4) RETURNING *',
        [companyName, companyEmail, companyPhone, companyAddress]
      );
  
      console.log("Inserted row:", result.rows[0]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error inserting contact:", err.message);
      console.error("Error details:", err);
      res.status(500).send('Error adding contact');
    }
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM "ContactList" WHERE contact_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const fields = req.body; // This can include any combo: name, email, phone, etc.
  
    // Get the keys of the fields to update
    const keys = Object.keys(fields);
  
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }
  
    // Build the SET clause dynamically
    const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
    const values = keys.map((key) => fields[key]);
  
    try {
      const result = await pool.query(
        `UPDATE "ContactList" SET ${setClause} WHERE contact_id = $${keys.length + 1} RETURNING *`,
        [...values, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
    

app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        'DELETE FROM "ContactList" WHERE "contact_id" = $1 RETURNING *',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).send('Contact not found');
      }
  
      console.log("Deleted row:", result.rows[0]);
      res.status(200).json({ message: 'Contact deleted successfully', deletedContact: result.rows[0] });
    } catch (err) {
      console.error("Error deleting contact:", err.message);
      res.status(500).send('Error deleting contact');
    }
  });
  
  
  // Testing
  app.get('/', (req, res) => {
    res.send('Contact Management System api!')
  })
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
