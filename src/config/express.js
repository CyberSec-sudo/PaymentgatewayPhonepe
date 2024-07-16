const express = require('express');
const config = require('./config');
const path = require('path');
const exceptionHandler = require('express-exception-handler');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const error = require('../api/middlewares/error');
const slowDown = require('express-slow-down');
const connectDB = require("../api/database/mongodb");

exceptionHandler.handle();

const limiter = slowDown({
  windowMs: 2000,
  delayAfter: 1, 
  delayMs: 1000, 
});

const app = express();

app.use(express.json());
//app.use(limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));
app.use(express.static(path.join(__dirname, '../public/assets')));
app.use('/dist/notflix', express.static(path.join(__dirname, '../../node_modules/notiflix/dist')));
const routes = require('../api/routes/');
app.use('/', routes);
app.use(error.handler);
connectDB();

module.exports = app;
