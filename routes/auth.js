const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();

//import URLs for DB
const {TEST_URL, PORT} = require('../config.js');
mongoose.connect(TEST_URL);
mongoose.Promise = global.Promise;

router.use(morgan('common'));
router.use(jsonParser);
router.use(bodyParser.urlencoded({ extended: true}));

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
      subject: user.username,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
    });
  };

const localAuth = passport.authenticate('local', {session: false});

//**********************************************************************************
//CRUD ROUTES
//**********************************************************************************

//get the token for user logging in
router.post('/login', localAuth, (req,res)=> {
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

//refresh expired JWT token w/ updated one
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  });
  

//restrict access only to logged in users

module.exports = {router};