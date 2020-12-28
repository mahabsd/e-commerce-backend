const mongoose=require('mongoose');
// const todoApi= require('../routes/clientApi');
var schema = mongoose.Schema;
var userSchema = new schema({
    firstName: { type: String },
    lastName:    { type: String},
    email : {type : String, required: true, unique: true},
    password : {type : String, required: true, unique: true},
    image : {type : String},
    role : {type : String,   default: 'basic',
    enum: ["basic", "admin"] }
});

module.exports = mongoose.model("user", userSchema)