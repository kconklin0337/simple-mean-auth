var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.model.js');


router.post('/register', function(req, res) {
  //registration route for signing up users
  User.register(new User({
                 username: req.body.username
               }),
      req.body.password, function(err, account){
        if(err) {
          return res.status(500).json({
          err: err
        });
       }
       passport.authenticate('local')(req, res, function(){
         return res.status(200).json({
           status: 'You have now taken the blue pill...'
         });
       });
    });
});

  router.post('/login', function(req, res, next) {
    //login route for logging in existing users
    // What do you notice about this function?
    passport.authenticate('local', function(err, user, info){
      if (err){
        return next(err);
      }
      if(!user){
        return res.status(401).json({
          err: info
        });
      }
      req.logIn(user, function(err){
        if(err){
          return res.status(500).json({
            err: "Looks like we couldn't find you..."
          });
        }
        res.status(200).json({
          status: "Welcome back!"
        });
      });
    })(req, res, next);
  });

  router.get('/logout', function(req, res) {
    //Logout route
      req.logout();
      res.status(200).json({
         Message: 'See you soon!'
      });
  });

  router.get('/status', function(req, res) {
    //Why do we need a status route?
    if(!req.isAuthenticated()){
      return res.status(200).json({
        status: false,
      });
    }
    res.status(200).json({
      status: true
    });
  });


module.exports = router;
