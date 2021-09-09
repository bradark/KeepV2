const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const User = require("../models/user");


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
module.exports.getMessages = function (keepEmail){
  fs.readFile('./gmailtracker/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), keepEmail, listMessages);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

 /** Creates an OAuth2 Client which is then passed to listmessages*/
function authorize(credentials, keepEmail, callback) {
  console.log(keepEmail);
  User.find(
    {email: keepEmail},
    function(err, docs){
      const {client_secret, client_id} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
      console.log(docs[0]);
      var token = (docs[0]).gmailtoken;
      oAuth2Client.setCredentials({
        refresh_token: token
      });
      callback(oAuth2Client, keepEmail);
    }
  );
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMessages(auth, keepEmail) {
  const gmail = google.gmail({version: 'v1', auth: auth});
  gmail.users.messages.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const messages = res.data.messages;
    if (messages.length) {
      messages.forEach((msg) => {
        gmail.users.messages.get({
          userId:'me',
          id: msg.id ,
        }, (err, res) => {
          if(res.data.snippet.includes('refund')){
            console.log(res.data.snippet);
            User.update(
              {email:keepEmail},
              { $addToSet: {mail: {mailstate:"refund", mailsnippet:res.data.snippet}}},
              function(err, docs){
                if(err){
                  console.log(err);
                }else{
                  console.log(docs);
                }
              }
            );
          }
          if(res.data.snippet.includes('sold')){
            console.log(res.data.snippet);
            User.update(
              {email:keepEmail},
              { $addToSet: {mail: {mailstate:"sold item", mailsnippet:res.data.snippet}}},
              function(err, docs){
                if(err){
                  console.log(err);
                }else{
                  console.log(docs);
                }
              }
            );
          }
        });
      });
    } else {
      console.log('No labels found.');
    }
  });
}
