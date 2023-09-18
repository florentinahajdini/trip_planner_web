const express = require('express');
const app = express();
const path = require("path");

const axios = require("axios").default;

const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local').Strategy;

const users = [];
const trips = new Map();



app.use(express.json());
app.use(session({
  secret: '123test123',
  resave: false,
  saveUninitialized: false,
}));

// Serve HTML files from the "files" directory
app.use(express.static(path.join(__dirname, 'files')));

// Serve image files from the "graphics" directory
app.use('/graphics', express.static(path.join(__dirname, 'graphics')));

// Passport Configuration
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

// Serve the login page when /login is accessed
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'login.html'));
  console.log('LOGIN PRESSED');
});

// Serve the SIGNUP page when /SIGNUP is accessed
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'signup.html'));
});

// NOW ACTUALLY SERVE MAINPAGE WHEN PRESSING LOGIN
app.get('/mainPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'mainPage.html'));
});

app.get('/mainPage', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'mainPage.html'));
});


// GET USERS TRIPS 

app.get('/my-trips', (req,res) => {
  const userId = req.session.passport.user; 
  const userTrips = trips.get(userId) || [];

  res.status(200).json(userTrips);
})


// CHECKING IF USER IS AUTHENTICATED BEFORE SWITCH
app.use('/mainPage', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
});




app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: '123test123',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Passport authentication routes
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/mainPage',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser={ 
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    };
    users.push(newUser);
    res.login(newUser, (err)=>{
      if(err){
        return next(err);
      }
    return res.redirect('/mainPage');
    }); // Redirect to the login page after successful signup
  } catch {
    res.redirect('/login');
  }
});

// POST A TRIP 
app.post('/add-trip', (req, res)=>{
  const userId= req.session.passport.user; //getting ID from session
  const tripDetails = req.body.tripDetails; 

  //creating array for trips 
  if(!trips.has(userId)){
  trips.set(userId, []);
  }
  const userTrips = trips.get(userId);
  userTrips.push(tripDetails);
  console.log(userTrips);

  res.status(200).json({message: 'Trip added successfully'});
});



app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/mainPage');
  }
  next();
}

//Weather endpoint fetches Weater API data: weather.js
app.get("/weather", async (req, res) => {
   
  const weatherAPIKey = "6ff36079724c0020a2809278b13da9ac";
  const city = req.query.city;     // query parameter to get city
  
  axios.get("https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + weatherAPIKey + "&q=" + city)
     .then(result => {   
        let filteredweatherData = {
           "temperature": result.data.main.temp,
           "wind": result.data.wind.speed,
           "city": result.data.name,
           "day": new Date().toLocaleDateString('en-EN', {"weekday": "long"}),
           "humidity": result.data.main.humidity,
           "pressure": result.data.main.pressure
        };         
        res.json(JSON.stringify(filteredweatherData))
        console.log(result.data);
     })
     .catch((error) => console.error("Fetch weather API data error:", error));
});

app.delete('/delete-city', (res,req) => {
  const cityName = req.body.cityName;
  delete cityName[req.body.id]
  res.status(200)
})

app.listen(3003, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server now listening on http://localhost:3003`);
  }
});
