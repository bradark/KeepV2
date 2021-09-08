const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
} ,
password :{
    type  : String,
    required : true
} ,
inventorycount :{
  type  : String,
  required : false,
  default:0
} ,

inventory :{
  type  : [],
  required  : false
} ,

sales :{
  type : [],
  required : false
} ,

intransitcount :{
  type  : String,
  required : false,
  default:0
} ,

salescount :{
  type  : String,
  required : false,
  default:0
} ,

date :{
    type : Date,
    default : Date.now
}
});
const User= mongoose.model('User',UserSchema);

module.exports = User;
