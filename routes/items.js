const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth')


router.post('/additem', ensureAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  User.update(
    {email:req.user.email},
    { $push: {inventory: {itemname:req.body.itemname, itemdescription:req.body.itemdescription, itemsku:req.body.itemsku, itemvalue:req.body.itemvalue}}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        console.log(docs);
      }
    }
  );
  res.redirect('/inventory');
})

module.exports = router;
