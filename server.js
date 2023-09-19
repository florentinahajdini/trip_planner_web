const express = require('express');
const app = express();
const path = require("path");
const cors = require('cors');

const axios = require("axios").default;

const bcrypt = require('bcrypt');
const session = require('express-session');

const FileStore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');

const fs = require('fs');
let usersRaw;
let users = [];
const userTodo = [];

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
app.use(cors());
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
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}


// Serve HTML files from the "files" directory
app.use(express.static(path.join(__dirname, 'files')));

// Serve image files from the "graphics" directory
app.use('/graphics', express.static(path.join(__dirname, 'graphics')));

// Serve the login page when /login is accessed
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'login.html'));
});

// Serve the SIGNUP page when /SIGNUP is accessed
app.get('/signup', (req, res) => {
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

app.post('/login',  (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.email === email);

    if (!user) {
        res.json({ success: false });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({success: false});
    } else {
        req.session.user = { id: user.id, username: user.username };
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
  console.log(userTrips);

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

// EDIT WITH PUT 
// app.put("/editTask", (req, res) => {
//   res.sendStatus(200);
// });

app.put("/editTask", (req, res) => {
  const taskID = Number(req.body["taskID"]);
  const task = req.body["task"];
  console.log(taskID)
  console.log(task)
  console.log(req.body)
  if (userTodo.length <= taskID) {  //add
    userTodo.push(task)
  } else if (userTodo.length > taskID){ //update
    if (task === "") {
      userTodo.splice(taskID, 1)
  } else {
    userTodo[taskID] = task
  }
} 
  console.log(userTodo)
  res.sendStatus(200);
});

app.listen(3003, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server now listening on http://localhost:3003`);
  }
});