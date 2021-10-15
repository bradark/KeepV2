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

authlink :{
  type  : String,
  required  : true
} ,

gmailtoken :{
  type  : {},
  required  : false,
  default : 0
} ,

inventorycount :{
  type: Number,
  required : false,
  default:0
} ,

ordersvalue :{
  type: Number,
  required : false,
  default:0
} ,

ordercount :{
  type: Number,
  required : false,
  default:0
} ,

inventoryvalue :{
  type: Number,
  required : false,
  default:0
} ,

inventory :{
  type  : [],
  required  : false
} ,

mail :{
  type  : [],
  required  : false
} ,

sales :{
  type : [],
  required : false
} ,

orders :{
  type : [],
  required : false
} ,

intransitcount :{
  type  : String,
  required : false,
  default:0
} ,

salescount :{
  type  : Number,
  required : false,
  default:0
} ,

date :{
    type : Date,
    default : Date.now
} ,

revenue :{
  type : Number
} ,

profit :{
  type : Number
}
});
const User= mongoose.model('User',UserSchema);

module.exports = User;
