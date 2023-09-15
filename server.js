const express = require('express');
const app = express();
const path = require("path");
const bcrypt = require('bcrypt');

app.use(express.json()) //THIS IS MIDDLEWARE


const port = process.env.PORT || 3003;

// Serve HTML files from the "files" directory
app.use(express.static(path.join(__dirname, 'files')));

// Serve image files from the "graphics" directory
app.use('/graphics',express.static(path.join(__dirname, 'graphics')));

// Serve the login page when /login is accessed
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'login.html'));
    console.log('HELOOOOOO')
});
// Serve the login page when /login is accessed
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'signup.html'));
});



// GET REQUEST USERS

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})
app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = { name: req.body.name, password: hashedPassword }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })
  app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
  })
  
  

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server now listening on http://localhost:${port}`);
    }
});




// MAYBE I NEED THIS LATER 






/*-----------------------ROUTES--------------------------------------------

  app.get('/', (req, res) => {
    // Handle the root route (e.g., display your main page)
    res.sendFile(__dirname,  'index.html'); // Adjust the file path accordingly
});

app.get('/login', (req, res) => {
    // Handle the login route (e.g., display the login page)
    res.sendFile(__dirname,  'login.html'); // Adjust the file path accordingly
});

app.get('/signup', (req, res) => {
    // Handle the signup route (e.g., display the signup page)
    res.sendFile(__dirname, '/signup.html'); // Adjust the file path accordingly
});
*/








/*const bodyParser = require('body-parser'); // Import body-parser middleware

app.use(bodyParser.json()); // Use body-parser to parse JSON requests */


/*app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}
))*/


/*app.get('/login', (req, res) => {
    // Handle login logic here
    res.send('Login page');
});

app.get('/signup', (req, res) => {
    // Handle signup logic here
    res.send('Signup page');
});
*/