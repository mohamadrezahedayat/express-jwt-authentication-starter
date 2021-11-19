const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

require('dotenv').config();

var app = express();

require('./config/database');

require('./models/user');

// Pass the global passport object into the configuration function
require('./config/passport')(passport);
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows our Angular application to make HTTP requests to Express application
app.use(cors());

// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

app.listen(3000);
