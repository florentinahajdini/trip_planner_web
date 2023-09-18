const express = require('express');
const app = express();
const path = require("path");

const axios = require("axios").default;

const bcrypt = require('bcrypt');
const session = require('express-session');
//const passport = require('passport');
//const initializePassport = require('./passport-config');
//const flash = require('express-flash');
//const methodOverride = require('method-override');
//const LocalStrategy = require('passport-local').Strategy;
const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');

const fs = require('fs');
let usersRaw;
let users = [];
fs.readFile('./files/users.json', 'utf-8', (err, jsonString) => {
  if (err) {
    console.log(err);
  } else {
    usersRaw = jsonString;
    users = JSON.parse(usersRaw.toString());
    console.log('users read');
  }
});
const trips = new Map();
app.use(cookieParser('cookie key'));


/*
 * Change details of session: secret could be an .env variable, saveUninitialized prevents unwanted users to be saved,
 * cookie maxAge specifies time after which cookie will be removed/renewed, store specifies storage middleware for cookies
 */
app.use(express.json());
app.use(
    session({
      secret: 'secret key',
      resave: false,
      saveUninitialized: false,
      cookie: {maxAge: 3600},
    })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

const isNotAuth = (req, res, next) => {
    console.log(req.session.id);
    if (req.session.userId) {
        return res.redirect('/mainPage');
    } else {
        next();
    }
}

// Serve HTML files from the "files" directory
app.use(express.static(path.join(__dirname, 'files')));

// Serve image files from the "graphics" directory
app.use('/graphics', express.static(path.join(__dirname, 'graphics')));

// Serve the login page when /login is accessed
app.get('/login', isNotAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'login.html'));
});

// Serve the SIGNUP page when /SIGNUP is accessed
app.get('/signup', isNotAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'signup.html'));
});

// NOW ACTUALLY SERVE MAINPAGE WHEN PRESSING LOGIN

app.get('/mainPage', isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'mainPage.html'));
});


// GET USERS TRIPS 

app.get('/my-trips', (req,res) => {
  const userId = req.session.passport.user; 
  const userTrips = trips.get(userId) || [];

  res.status(200).json(userTrips);
})

app.get('/user', (req, res) => {
    return res.send(req.session.user);
})

app.use(express.urlencoded({ extended: false }));

// TODO change 2nd argument
app.post('/login',  (req, res) => {
    const {email, password} = req.body;

    let user = users.find(u => u.email === email);

    if (!user) {
        return res.redirect('/login');
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.redirect('/login');
    } else {
        req.session.isAuthenticated = true;
        req.session.user = user;
        res.redirect('/mainPage');
    }
});
// TODO change body
app.post('/signup', async (req, res) => {
  try {
      if (users.find((user) => user.email === req.body.email)) {
          return res.redirect('/signup');
      }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser={ 
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    };
    console.log(JSON.stringify(newUser));
    users.push(newUser);
      const data = JSON.stringify(users, null, 2);
      fs.writeFile('./files/users.json', data, 'utf-8', (err) => {
          if (err) throw err;
          console.log('users written successfully');
      });
      res.redirect('/login');
  } catch {
    res.redirect('/signup');
  }
});

// POST A TRIP 
app.post('/add-trip', (req, res)=>{
  const userId= req.session.user.id; //getting ID from session
  const tripDetails = req.body.tripDetails; 

  //creating array for trips 
  if(!trips.has(userId)){
  trips.set(userId, []);
  }
  const userTrips = trips.get(userId);
  userTrips.push(tripDetails);

  res.status(200).json({message: 'Trip added successfully'});
});



app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

//Weather endpoint fetches Weather API data: weather.js
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



app.listen(3003, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server now listening on http://localhost:3003`);
  }
});