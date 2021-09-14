const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth')
const GmailTracker = require('../gmailtracker/index');

router.post('/getmail', ensureAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  GmailTracker.getMessages(req.user.email);
  //GmailTracker.watchMail(req.user.email);
  setTimeout(function(){
    res.redirect('/gmailtracker');
  }, 2000);
})

module.exports = router;
