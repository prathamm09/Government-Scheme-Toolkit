const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/main', express.static(path.join(__dirname, 'public', 'main')));


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pratham@09102001', 
  database: 'dbms'
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  console.log(`[${new Date().toLocaleString()}] GET request received for /`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/login', (req, res) => {
  console.log(`[${new Date().toLocaleString()}] POST request received for /login`);
  const { usernameOrEmail, password } = req.body;
  console.log(`[${new Date().toLocaleString()}] Username or Email: ${usernameOrEmail}`);
  db.query('SELECT * FROM users WHERE username = ? OR email = ?', [usernameOrEmail, usernameOrEmail], (error, results) => {
    if (error) {
      console.error(`[${new Date().toLocaleString()}] Error querying database:`, error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error(`[${new Date().toLocaleString()}] Error comparing passwords:`, err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            if (isMatch) {
              console.log(`[${new Date().toLocaleString()}] Successful login for user: ${user.username}`);
              if (user.email === 'resetschemedbms@gmail.com') {
                res.redirect('/main/admin_dashboard.html'); 
              } else {
                res.redirect('/main/dashboard.html'); 
              }
            } else {
              console.log(`[${new Date().toLocaleString()}] Invalid password for user: ${user.username}`);
              res.status(401).json({ error: 'Invalid username or password' });
            }
          }
        });
      } else {
        console.log(`[${new Date().toLocaleString()}] User not found for username or email: ${usernameOrEmail}`);
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  });
});




app.post('/signup', (req, res) => {
  console.log(`[${new Date().toLocaleString()}] POST request received for /signup`);
  const { username, email } = req.body;
  console.log(`[${new Date().toLocaleString()}] Username: ${username}, Email: ${email}`);
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error(`[${new Date().toLocaleString()}] Error hashing password:`, err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results) => {
        if (error) {
          console.error(`[${new Date().toLocaleString()}] Error inserting user into database:`, error);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          console.log(`[${new Date().toLocaleString()}] User signed up successfully: ${username}`);
          res.redirect('main/dashboard.html');
        }
      });
    }
  });
});

const showMessage = (res, message) => {
  res.status(200).json({ message: message });
};

app.post('/forgot', async (req, res) => {
  console.log(`[${new Date().toLocaleString()}] POST request received for /forgot`);
  const { email } = req.body;
  console.log(`[${new Date().toLocaleString()}] Email found: ${email}`);

  try {
     
      const temporaryPassword = generateTemporaryPassword();

      
      bcrypt.hash(temporaryPassword, 10, async (err, hashedPassword) => {
          if (err) {
              console.error(`[${new Date().toLocaleString()}] Error hashing temporary password:`, err);
              return res.status(500).json({ error: 'Internal server error' });
          }

          try {
        
              await updateUserPassword(email, hashedPassword);

              // Send email with the temporary password
              sendResetPasswordEmail(email, temporaryPassword);
              console.log(`[${new Date().toLocaleString()}] Temporary password updated in the database for email: ${email}`);

              showMessage(res, 'Password reset email sent');
          } catch (error) {
              console.error(`[${new Date().toLocaleString()}] Error updating user password or sending email:`, error);
              res.status(500).json({ error: 'Error resetting password' });
          }
      });
  } catch (error) {
      console.error(`[${new Date().toLocaleString()}] Error generating temporary password:`, error);
      res.status(500).json({ error: 'Error resetting password' });
  }
});


function generateTemporaryPassword() {
 
  return Math.random().toString(36).slice(2);
}

// Function to update user's password in the database
function updateUserPassword(email, hashedPassword) {
  return new Promise((resolve, reject) => {
    db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (error, results) => {
      if (error) {
        console.error(`[${new Date().toLocaleString()}] Error updating user password:`, error);
        reject(error);
      } else {
        console.log(`[${new Date().toLocaleString()}] Temporary password updated in the database for email: ${email}`);
        resolve();
      }
    });
  });
}


// Function to send reset password email
function sendResetPasswordEmail(email, temporaryPassword) {
  // Create Nodemailer transporter with SMTP and app password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resetschemedbms@gmail.com', // Your Gmail email address
      pass: 'yhwd airl evjh rrcp' // Your app password
    }
  });

  // Send email
  transporter.sendMail({
    from: 'resetschemedbms@gmail.com', // Your Gmail email address
    to: email,
    subject: 'Password Reset',
    text: `Your temporary password for resetting the password is: ${temporaryPassword}`
  }, (error, info) => {
    if (error) {
      console.error(`[${new Date().toLocaleString()}] Error sending email:`, error);
    } else {
      console.log(`[${new Date().toLocaleString()}] Password reset email sent:`, info.response);
    }
  });
}

app.post('/search', (req, res) => {
  console.log(`[${new Date().toLocaleString()}] POST request received for /search`);
  console.log(`[${new Date().toLocaleString()}] Request body:`, req.body);
  
  const { age, gender, category, religion, maritalstatus, income, state } = req.body;
  
  console.log(`[${new Date().toLocaleString()}] Parameters extracted:`, { age, gender, category, religion, maritalstatus, income, state });
  
  // Construct the SQL query based on user inputs
  const sql = `
  SELECT s.scheme_name, sd.*
  FROM scheme_name s
  JOIN scheme_details sd ON s.scheme_id = sd.scheme_id
  WHERE 
      sd.state = ? AND
      sd.religion = ? AND
      sd.maritalstatus = ? AND
      sd.income = ? AND
      sd.gender = ? AND
      sd.category = ? AND
      sd.age <= ?
  
  `;


  console.log(`[${new Date().toLocaleString()}] SQL Query: ${sql}`);
  console.log(`[${new Date().toLocaleString()}] Parameters: ${[state, religion, maritalstatus, income, gender, category, age].join(', ')}`);
  
  db.query(sql, [state, religion, maritalstatus, income, gender, category, age], (error, results) => {
    if (error) {
      console.error(`[${new Date().toLocaleString()}] Error querying database for schemes:`, error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length > 0) {
        console.log(`[${new Date().toLocaleString()}] Found ${results.length} schemes matching the criteria`);
        res.status(200).json({ schemes: results });
      } else {
        console.log(`[${new Date().toLocaleString()}] No schemes found matching the criteria`);
        res.status(404).json({ error: 'No schemes found matching the criteria' });
      }
    }
  });
});


// Handle POST request to add a new scheme to the database
app.post('/add-scheme', (req, res) => {
  console.log(`[${new Date().toLocaleString()}] POST request received for /add-scheme`);

  // Extract data from the request body
 // Extract data from the request body
const { id, name, year, age, gender, category, religion, maritalstatus, income, state } = req.body;


  // Construct SQL query to insert the new scheme name into the scheme_name table
  const insertSchemeNameSQL = `
    INSERT INTO scheme_name (scheme_id, scheme_name,year)
    VALUES (?, ?, ?)
  `;

  // Execute the SQL query to insert the new scheme name into the scheme_name table
  db.query(insertSchemeNameSQL, [id, name, year], (error, results) => {
      if (error) {
          console.error(`[${new Date().toLocaleString()}] Error inserting scheme name into database:`, error);
          res.status(500).json({ error: 'Internal server error' });
      } else {
          console.log(`[${new Date().toLocaleString()}] Scheme name added to the database`);
          
          // Once the scheme name is added successfully, insert scheme details into scheme_details table
          const insertSchemeDetailsSQL = `
            INSERT INTO scheme_details (scheme_id, age, gender, category, religion, maritalstatus, income, state)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          // Execute the SQL query to insert scheme details into scheme_details table
          db.query(insertSchemeDetailsSQL, [id, age, gender, category, religion, maritalstatus, income, state], (error, results) => {
              if (error) {
                  console.error(`[${new Date().toLocaleString()}] Error inserting scheme details into database:`, error);
                  res.status(500).json({ error: 'Internal server error' });
              } else {
                  console.log(`[${new Date().toLocaleString()}] Scheme details added to the database`);
                  res.status(200).json({ message: 'Scheme added successfully' });
              }
          });
      }
  });
});

// Handle contact form submission
app.post('/contact', (req, res) => {
  console.log(`[${new Date().toLocaleString()}] POST request received for /contact`);

  const { name, mobile, email, message } = req.body;

  console.log(`[${new Date().toLocaleString()}] Contact form submitted with data:`);
  console.log('Name:', name);
  console.log('Mobile:', mobile);
  console.log('Email:', email);
  console.log('Message:', message);

  // Insert form data into the contact_us table
  const insertContactQuery = 'INSERT INTO contact_us (name, mobile, email, message) VALUES (?, ?, ?, ?)';
  db.query(insertContactQuery, [name, mobile, email, message], (error, results) => {
    if (error) {
      console.error(`[${new Date().toLocaleString()}] Error inserting contact form data into database:`, error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log(`[${new Date().toLocaleString()}] Contact form data inserted into database`);
      // Send success message back to client
      res.status(200).json({ message: 'Contact form submitted successfully' });
    }
  });
});


app.listen(port, () => {
  console.log(`[${new Date().toLocaleString()}] Server is running on http://localhost:${port}`);
});
