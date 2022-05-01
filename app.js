const express = require("express");
const rateLimit = require('express-rate-limit');
const cors = require("cors");
const bodyParser = require('body-parser');
const passport = require('passport');
const {passportFxn} = require('./Middlewares/passport');


//Initialize Express
const app = express();

//Handling Cors
app.use(cors());

//parsing incoming data
app.use(bodyParser.json());

//Initializing Passport
app.use(passport.initialize());
passportFxn(passport);


const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: "To many request from this IP, Please try again Later",
});

app.use('/api', require('./Routes/User'));


module.exports = app;