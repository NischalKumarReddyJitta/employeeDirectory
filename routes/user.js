var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var bcrypt = require('bcrypt');
var User = require('../models/User');

/* GET - home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

/* GET - index page. */
router.get('/index', function(req, res, next) {
  if(req.session && req.session.username){
    res.render('index', { username: req.session.username });
  }else{
    res.redirect('login');
  }
});

/* GET - login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { error: '' });
});

/* GET - logout page. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    res.redirect('login');
  });
});

/* POST - User login. */
router.post('/login', function(req, res, next) {
  if(req.session && req.session.username){
    res.render('index', {});
  }else{
    // User.authenticate(req.body.username, req.body.password, function(){

    // });
    User.find({username: req.body.username}, function(err, data){
      if(data.length === 0){
        req.session.destroy(function(err){
          res.render('login', { error: 'User authentication failed. Invalid credentials.' });
        });
      }else{
        req.session.username = data[0].username;
        res.redirect('index');
      }
    });
  }
});

/* POST - Create users. */
router.post('/signup', function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err, savedUser){
    if(err){
      console.log(chalk.red('error occured while saving the user in the database'));
      console.log(chalk.red(err));
      res.status(500);
      res.json({message: 'Error occured while saving the user in the database'});
    }else{
      console.log(chalk.green('successfully saved the user in the database with id' + savedUser._id));
      req.session.username = savedUser.username;
      res.status(201);
      res.redirect('index');
    }
  });
});

module.exports = router;
