const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth')
//login page
router.get('/', (req,res)=>{
    res.render('welcome');
})
//register page
router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
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

module.exports = router;
