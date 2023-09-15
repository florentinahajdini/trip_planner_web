const express = require('express');
const app = express();
const path = require("path");
const bcrypt = require('bcrypt');
const { nextTick } = require('process');// WHAT DID I USE THIS FOR???
const session = require('express-session');
const passport = require('passport');
const initializePassport = require ('./passport-config');
const flash = require('express-flash');
const methodOverride =require('method-override');



app.use(express.json()) //THIS IS MIDDLEWARE
app.use(session({
  secret: '123test123',
  resave: false, 
  saveUninitialized: false,
}));

const port = process.env.PORT || 3003;

// Serve HTML files from the "files" directory
app.use(express.static(path.join(__dirname, 'files')));

// Serve image files from the "graphics" directory
app.use('/graphics',express.static(path.join(__dirname, 'graphics')));

// Serve the login page when /login is accessed
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'files', 'login.html'));
    console.log('LOGIN PRESSED')
});

// Serve the login page when /login is accessed
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'signup.html'));
});

//CHECKING IF USER IS AUTHENTICATED BEFORE SWITCH
app.use('/mainPage', (req,res, next)=> {
  if(!req.session.user){
    return res.redirect('/login');
  }
  next();
});
//NOW ACTUALLY SERVE MAINPAGE WHEN PRESSING  LOGIN
app.get('/mainPage', (req,res) =>{
  res.sendFile(path.join(__dirname, 'files', 'mainPage.html'));
});

//SERVE SIGNUP
app.get('/signup', (req, res) =>{
  res.sendFile(path.join(__dirname, 'files', 'signup.html'));
});
// 
app.get('/mainPage', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'mainPage.html'));
});
app.use(flash());
app.use(express.urlencoded({extended:false}))
app.use(session({
  secret: '123test123',
  resave: false, 
  saveUninitialized: false,
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.html')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/mainPage',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup.html')
})











initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// GET REQUEST USERS
const users = []

app.get('/users', (req, res) => {
    res.json(users)
})
app.post('/users', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = { name: req.body.name, password: hashedPassword, email: req.body.email };
      users.push(user);
      res.status(201).send('User created successfully');
  } catch {
      res.status(500).send('Failed to create user');
  }
});

  app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        req.session.user= user;
        res.redirect('/mainPage');
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
  });
  
  app.post('/signup',checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      //const user = { name: req.body.name, password: hashedPassword, email: req.body.email };
      //users.push(user);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login'); // Redirect to the login page after successful signup
    } catch {
      res.redirect('/signup')
    }
  });

app.delete('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})

  function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/login')
  }

  function checkNotAuthenticated(req, res, next){
    if(req. isAuthenticated()){
      return res.redirect('/mainPage')
    }
  next()
  }



app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server now listening on http://localhost:${port}`);
    }
});

// MAYBE I NEED THIS LATER 

/*-----------------------ROUTES--------------------------------------------



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