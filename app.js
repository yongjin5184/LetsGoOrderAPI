var express = require('express');
var path = require('path');
var logger = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var restaurants = require('./routes/api/restaurants');
var home = require('./routes/views/home');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// set view
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//set route
app.use('/', index);
app.use('/api/restaurants', restaurants);
app.use('/views/home', home);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("서버스타트");
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
