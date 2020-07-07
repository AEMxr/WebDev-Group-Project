// All dependencies
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const User = require('./models/user');

// routes setup
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// connect to db for development phase, will switch to a mongodb cluster for production
mongoose.connect("mongodb://localhost/pings", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// message that loads whenever server is run
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// setup for express session
app.use(session({
  secret: 'Pings',
  resave: false,
  saveUninitialized: true
}));

// setup for passport
app.use(passport.initialize());
app.use(passport.session());

// Passport, use createStrategy instead of authenticate
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);


// local variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.title = 'Pings';
  // success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // failure flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next middleware chain
  next();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
