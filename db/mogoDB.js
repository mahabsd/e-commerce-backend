const { Mongoose } = require("mongoose");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/challenge', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then(result =>{
    console.log("connected to dataBase");
}).catch(err =>{console.log(err);});
