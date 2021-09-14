const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth')


router.post('/additem', ensureAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  var itemvalue = parseInt(req.body.itemvalue);
  var itemsku = randomNum(1000, 10000);
  var removeBtn = "<form action=\"/items/removeitem/" + itemsku + "\" method=\"POST\"><button type=\"submit\" id=\"removebtn\" class=\"btn btn-danger\" >Remove</button></form>";
  var markSoldBtn = "<a href=\"#\" value=\"" + req.body.itemname + "\" id=\"marksoldbtn\" class=\"btn btn-success\" >Mark Sold</a>";
  User.update(
    {email:req.user.email},
    { $push: {inventory: {itemname:req.body.itemname, itemdescription:req.body.itemdescription, itemsku:itemsku, itemvalue:req.body.itemvalue, removebtn:removeBtn, marksoldbtn:markSoldBtn}}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        User.findOneAndUpdate(
          {email:req.user.email},
          {$inc:{ inventorycount: 1 }},
          function(err, docs){
            if(err){
              console.log(err);
            }else{
              User.findOneAndUpdate(
                {email:req.user.email},
                {$inc:{ inventoryvalue: itemvalue }},
                function(err, docs){
                  if(err){
                    console.log(err);
                  }else{
                    res.redirect('/inventory');
                  }
                }
              )
            }
          }
        )
      }
    }
  );
})

router.post('/removeitem/:itemsku', ensureAuthenticated, (req, res) => {
  User.updateOne(
    {email:req.user.email},
    { $pull: { inventory: { itemsku: parseInt(req.param("itemsku")) }}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        User.findOneAndUpdate(
          {email:req.user.email},
          {$inc:{ inventorycount: -1 }},
          function(err, docs){
            if(err){
              console.log(err);
            }else{
              res.redirect('/inventory');
            }
          }
        )
      }
    }
  );
})

function randomNum(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

module.exports = router;
