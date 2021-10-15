const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require("./models/user");
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const https = require('https');
const gmailTracker = require('./gmailtracker/index.js');
const fs = require('fs');
const request = require('request');
const { google } = require('googleapis')
const urlParse = require('url-parse');
const queryParser = require('query-string');
var bodyParser = require('body-parser');

//passport config:
require('./config/passport')(passport)
//mongoose
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('Keep succesfully cpnnected to DB'))
.catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })

app.use(express.static("resources"));
app.use(express.static("Images"));


//Routes
app.use('/items',require('./routes/items'));
app.use('/gmailtracker',require('./routes/gmailtracker'));
app.use('/sales',require('./routes/sales'));
app.use('/orders',require('./routes/orders'));
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.post('/getAuthUrl/:useremail', (req, res) => {
  fs.readFile('./gmailtracker/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const {client_secret, client_id, redirect_uris} = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: JSON.stringify({
        useremail: req.param("useremail")
      })
    })
    request(url, (err, response, body) => {
      res.redirect(url);
    })
  });
})

app.get('/steps', async(req, res) => {
  fs.readFile('./gmailtracker/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const queryUrl = new urlParse(req.url);
    const code = queryParser.parse(queryUrl.query).code;
    const userEmail = (JSON.parse(queryParser.parse(queryUrl.query).state)).useremail;
    const {client_secret, client_id, redirect_uris} = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    storeToken(code, oAuth2Client, userEmail);
  });
  res.redirect('/gmailtracker');
});

function storeToken(code, oauth2Client, userEmail){
  oauth2Client.getToken(code, (err, token) =>{
    console.log(token);
    if(token){
      User.update(
        {email: userEmail},
        {$set: {gmailtoken: token.refresh_token}},
        function(){
          console.log("TOKEN ADDED");
        }
      );
    }else{
      console.log("REFRESH TOKEN STILL ACTIVE");
    }
  })
}

app.listen(80, function () {
  console.log("Keep running on port : 80");
});
