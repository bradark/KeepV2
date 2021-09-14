const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth')

router.post('/addorder', ensureAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  var ordervalue = parseInt(req.body.ordercost);
  var ordernumber = req.user.ordercount + 1 + randomNum(1000, 10000);
  var removeorderbtn = "<form action=\"/orders/removeorder/" + ordernumber + "\" method=\"POST\"><button type=\"submit\" id=\"removebtn\" class=\"btn btn-danger\" >Remove</button></form>";
  User.update(
    {email:req.user.email},
    { $push: {orders: {ordernumber:ordernumber, itemname:req.body.itemname, orderdescription:req.body.orderdescription, ordercost:req.body.ordercost, removeorderbtn:removeorderbtn}}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        User.findOneAndUpdate(
          {email:req.user.email},
          {$inc:{ ordercount: 1 }},
          function(err, docs){
            if(err){
              console.log(err);
            }else{
              User.findOneAndUpdate(
                {email:req.user.email},
                {$inc:{ ordersvalue: ordervalue }},
                function(err, docs){
                  if(err){
                    console.log(err);
                  }else{
                    res.redirect('/orders');
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

router.post('/removeorder/:ordernumber', ensureAuthenticated, (req, res) => {
  User.updateOne(
    {email:req.user.email},
    { $pull: { orders: { ordernumber: parseInt(req.param("ordernumber")) }}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        User.findOneAndUpdate(
          {email:req.user.email},
          {$inc:{ ordercount: -1 }},
          function(err, docs){
            if(err){
              console.log(err);
            }else{
              res.redirect('/orders');
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
