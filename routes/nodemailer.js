const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
        user: 'mahabsd@gmail.com',
        pass: '****'
    }
});

// send mail with defined transport object
router.post('/send', function (req, res) {

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'mahabsd@gmail.com',
            to: req.body.email,
            subject: '', // Subject line

            html: '<b> "votre session à été crée avec succée, pour vous connecter allez sur" + http://127.0.0.1:3000</b>' // html body 
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.send(error);
            }
            return res.send("mail send successfully");
        });

})

module.exports = router;