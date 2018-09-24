var createError = require('http-errors');
var express = require('express');
var chalk = require('chalk');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configure session
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: 'shh...'
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
mongoose.connect('mongodb://ds261342.mlab.com:61342/keystone_db',
                 	{
                 		user: 'dev_admin', 
                 		pass: 'Nischal@123'},
                 		function(err){
		                 	if(err){
								console.log(chalk.red('Database connection error'));
							}else{
								console.log(chalk.green('connected to keystone_db database'));
							}
						}
				);

app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
