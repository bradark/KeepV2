const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth')
//login page
router.get('/', (req,res)=>{
    res.render('welcome');
})

router.get('/account', ensureAuthenticated, (req,res)=>{
    res.render('dashboard', {
      user: req.user
    });
})

//register page
router.get('/register', ensureAuthenticated, (req,res)=>{
    res.render('register');
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user: req.user
    });
})

router.get('/newdashboard', ensureAuthenticated, (req, res) =>{
  res.render('newdashboard',{
    user: req.user
  });
})

router.get('/inventory',ensureAuthenticated,(req,res)=>{
    res.render('inventory',{
        user: req.user
    });
})

router.get('/sales', ensureAuthenticated, (req, res) =>{
  res.render('sales',{
    user: req.user
  });
})

router.get('/orders', ensureAuthenticated, (req, res) =>{
  res.render('orders',{
    user: req.user
  });
})

router.get('/gmailtracker', ensureAuthenticated, (req, res) =>{
  res.render('gmailtracker',{
    user: req.user
  });
})

module.exports = router;
