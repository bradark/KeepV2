const User = require("../models/user");

module.exports.parseMail = function (keepEmail, snippet){
  if(snippet.includes("refund")){
    var mailstate = "refund";
    addMailToDB(keepEmail, snippet, mailstate);
  }else if(snippet.includes("sold")){
    var mailstate = "sale";
    addMailToDB(keepEmail, snippet, mailstate);
  }else if(snippet.includes("your order")){
    var mailstate = "order";
    addMailToDB(keepEmail, snippet, mailstate);
  }
}

function addMailToDB(keepEmail, snippet, mailstate){
  User.update(
    {email:keepEmail},
    { $addToSet: {mail: {mailstate:"<div style=\"max-width:100px; max-height:25px; text-align:center; padding:2px;\" class=\"alert alert-warning\" role=\"alert\"><p class=\"alert-heading\">" + mailstate + "</p></div>", mailsnippet:snippet}}},
    function(err, docs){
      if(err){
        console.log(err);
      }else{
        console.log(docs);
      }
    }
  );
}
