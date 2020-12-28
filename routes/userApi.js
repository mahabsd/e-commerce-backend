const express = require('express');
const router = express.Router();
const User = require("../models/user")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const passport = require('passport');
const nodemailer = require('nodemailer');


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP", {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
        user: 'mahabsd@gmail.com',
        pass: "****"
    }
});

//add new user
router.post('/user/add/', ensureToken, (req, res) => {
            jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                if (err) {

                    res.status(403)

                } else {
                    var user = new User(req.body);
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        user.password = hash;
                        user.save().then(item => {
                            res.status(200).json();
                            console.log("datea saved " + user.password);
                        }).catch(err => {
                            console.log(err);
                        });
                    });
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: 'mahabsd@gmail.com',
                        to: req.body.email,
                        subject: 'compte crée', // Subject line
                        text: 'votre mot de passe est :' + req.body.password,
                        html: '<b> <p>votre session à été crée avec succée, votre mot de passe est :  ' + req.body.password + '.</p> <p>pour vous connecter allez sur: <a href =" http://127.0.0.1:3000">notre site</a></p></b>' // html body 
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return res.send(error);
                        }
                        return res.send(req.body);
                    });
                }
            });

            });

            //get by Id
            router.get('/user/:id', ensureToken, (req, res) => {
                jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                    if (err) {

                        res.status(403)

                    } else {
                        User.findById(req.params.id).then(data => {
                            res.status(200).json(data);
                            // res.send(data); la meme que json(data)
                        }).catch(err => res.status(400).json('Error: ' + err));
                    }
                });
            });
            //delete by Id
            router.delete('/user/delete/:id', ensureToken, (req, res) => {
                jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                    if (err) {

                        res.status(403)

                    } else {

                        User.findByIdAndDelete(
                            req.params.id, req.body).then(function () {
                            res.status(200).json("user deleted successfully");

                        }).catch(err => res.status(400).json('Error: ' + err));
                    }

                })

            });

            //update by Id
            router.put('/user/update/:id', ensureToken, (req, res) => {

                jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                    if (err) {

                        res.status(403)

                    } else {
                        User.findByIdAndUpdate(req.params.id, req.body).then(function (user) {
                            res.status(200).json(
                                req.body,
                            );
                            // res.send();
                        }).catch(err => res.status(400).json('Error: ' + err));
                    }
                });

            });
            //get All users
            router.get('/getAllusers', ensureToken, (req, res) => {
                jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                    if (err) {

                        res.status(403)

                    } else {
                        User.find().then(function (users) {
                            res.send(users)
                            res.status(200).json();
                        }).catch(err => res.status(400).json('Error: ' + err));
                    }
                });


            });
            //affect todo for every user 
            router.put('/affectuserTask/:idUser/:idTodo', ensureToken, (req, res) => {
                console.log("bonj");

                jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                    if (err) {
                        res.status(403)
                        console.log("hi " + err);

                    } else {
                        User.findByIdAndUpdate(req.params.idUser, {
                            $push: {
                                clients: req.params.idTodo
                            }
                        }).then((user) => {
                            res.status(200).json(user);

                        }).catch(err => res.status(400).json('Error: ' + err));
                    }

                });


            });

            //splice todo for every user 
            router.delete('/deleteuserTask/:idUser/:idTodo', ensureToken, (req, res) => {
                jwt.verify(req.token, process.env.JWT_KEY, (err) => {
                    if (err) {

                        res.status(403)

                    } else {
                        User.findByIdAndUpdate(req.params.idUser, {
                            $pull: {
                                clients: req.params.idTodo
                            }
                        }).then((user) => {
                            res.status(200).json(user);
                        }).catch(err => res.status(400).json('Error: ' + err));
                    }
                });

            });

            //login
            router.post('/user/login/', (req, res) => {

                User.findOne({
                    email: req.body.email
                }).then(user => {
                    //if user not exist then return status 400
                    if (!user) return res.status(400).json({
                        msg: "User does not exist"
                    })

                    bcrypt.compare(req.body.password, user.password, (err, data) => {
                        //if error than throw error
                        if (err) throw err

                        //if both match then you can do anything
                        if (data) {
                            var token = jwt.sign(req.body, 'secret');
                            return res.status(200).json({
                                user,
                                token: token,
                                msg: "Login success"
                            })
                        } else {
                            return res.status(401).json({
                                msg: "Invalid credencial "
                            })
                        }

                    })

                })

            });

            //authentification
            function ensureToken(req, res, next) {
                const bearerHeader = req.headers["authorization"];
                if (typeof bearerHeader !== "undefined") {

                    const bearer = bearerHeader.split(" ");
                    const bearerToken = bearer[1];
                    req.token = bearerToken;
                    next();

                } else {
                    console.log(bearerHeader);
                    res.sendStatus(401);
                }
            };

            // sign in with passport

            loginWithPassport = (req, res, next) => {
                return passport.authenticate('local', {
                    session: false
                }, (err, passportUser, info) => {
                    if (err) {
                        return next(err);
                    }

                    if (passportUser) {
                        console.log(passportUser);

                        const user = passportUser;
                        const token = jwt.sign({
                                email: passportUser.email,
                                userId: passportUser._id
                            },
                            process.env.JWT_KEY, {
                                expiresIn: "1h"
                            }
                        );
                        user.token = token

                        return res.status(200).json({
                            firstName: passportUser.firstName,
                            lastName: passportUser.lastName,
                            email: passportUser.email,
                            token: token
                        });
                    }

                    return res.status(400).json(info);
                })(req, res, next);

            }


            router.post('/loginWithPassport', loginWithPassport);

            module.exports = router;