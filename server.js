var express = require('express');
var bodyParser = require('body-parser');
const hostname = "127.0.0.1";
const port = 3000;
var app =express();
require('./db/mogoDB')
//require('./routes/scheduledemailsApi')
require('./authWithPassport/auth');
const clientApi= require('./routes/clientApi');
const fournisseurApi= require('./routes/fournisseurApi');
const usersApi = require('./routes/userApi')
const mailApi = require("./routes/nodemailer")
const multerApi = require("./routes/multerApi")


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/clients', clientApi);
app.use('/fournisseurs', fournisseurApi);
app.use('/users', usersApi);
app.use('/emails', mailApi);
app.use('/multers', multerApi);
app.use('/img', express.static('img'));


  



app.listen(port,hostname, ()=>{
    console.log("server is running at http://"+hostname+":"+port);
});