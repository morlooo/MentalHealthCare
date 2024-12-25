var createError = require('http-errors');
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passport = require('./config/passport');

var Routes = require('./routes/index');

const { corsOptions } = require('./config/config');
var dotenv = require('dotenv');
dotenv.config({ path: '.env' });

var app = express();

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup

app.use('/', Routes);

app.use(express.static('public'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ 'status': false, 'message': err.message });
});

module.exports = app;
