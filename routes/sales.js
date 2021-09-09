const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth')


router.post('/addsale', ensureAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  var removeBtn = "<form action=\"/sales/removesale/" + req.body.saleitem + "\" method=\"POST\"><button type=\"submit\" id=\"removebtn\" class=\"btn btn-danger\" >Remove</button></form>";
  //var markSoldBtn = "<a id=\"marksoldbtn\" href=\"/marksold/" + req.body.itemsku + "\" class=\"btn btn-success\" >Mark Sold</a>";;
  User.update(
    {email:req.user.email},
    { $push: {sales: {saleitem:req.body.saleitem, salemethod:req.body.salemethod, saleprice:req.body.saleprice, saleprofit:req.body.saleprofit, removebtn:removeBtn}}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        console.log(docs);
      }
    }
  );
  res.redirect('/sales');
})

router.post('/marksold', ensureAuthenticated, (req, res) => {
  var removeBtn = "<form action=\"/sales/removesale/" + req.body.saleitem + "\" method=\"POST\"><button type=\"submit\" id=\"removebtn\" class=\"btn btn-danger\" >Remove</button></form>";
  User.update(
    {email:req.user.email},
    { $push: {sales: {saleitem:req.body.saleitem, salemethod:req.body.salemethod, saleprice:req.body.saleprice, saleprofit:req.body.saleprofit, removebtn:removeBtn}}},
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

router.post('/removesale/:itemname', ensureAuthenticated, (req, res) => {
  User.updateOne(
    {email:req.user.email},
    { $pull: { sales: { saleitem: req.param("itemname") }}},
    function(err, docs){
      if(err){
        console.log(err);
      }
    }
  );
  res.redirect('/sales');
})

module.exports = router;
