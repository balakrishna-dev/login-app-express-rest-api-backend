require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const db = require('./db-con');
const app = express();
const port = process.env.PORT || 4000;

<<<<<<< HEAD

=======
const userData = {
  userId: "789789",
  password: "123456",
  name: "Balakrishna vardhineni",
  username: "bala@123",
  isAdmin: true
};
>>>>>>> 2768a413327575520ee18794ccd66300f0a192e5

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {

  var token = req.headers['authorization'];
  if (!token) return next(); 

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; 
      next();
    }
  });
});


app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});



var con = db.connection();
var userData;

app.post('/users/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }
  
  con.connect( function(err){
  if(err) throw err;
    console.log("connected...");
    const query = "select * from test.users where username= ? and password = ?";
    con.query(query,[user,pwd] ,function (err, result, fields) {
        if (err) throw err;
         userData = result[0];
    });
  }); 
  console.log(userData.username);
  if (user !== userData.username || pwd !== userData.password) {
    console.log(userData.username);
    return res.status(401).json({
      error: true,
      message: "Username or Password is Wrong."
    });
  }

  const token = utils.generateToken(userData);

  const userObj = utils.getCleanUser(userData);

  return res.json({ user: userObj, token });
});


app.get('/verifyToken', function (req, res) {

  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    if (user.userId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }
    var userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});
