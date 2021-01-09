const express = require('express');
const router = express.Router();
const Type = require("../models/category")
const jwt = require("jsonwebtoken");



//add new category
router.post('/category/add/', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            var type = new Type(req.body);
            type.save().then(item => {
                res.status(200).json();
                console.log("data saved ");
            }).catch(err => {
                console.log(err);
            });


        }
    });

});
//get category by Id
router.get('/category/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Type.findById(req.params.id).then(data => {
                res.status(200).json(data);
                // res.send(data); la meme que json(data)
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });
});
//delete category by Id
router.delete('/category/delete/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {

            Type.findByIdAndDelete(
                req.params.id, req.body).then(function () {
                res.status(200).json("type deleted successfully");

            }).catch(err => res.status(400).json('Error: ' + err));
        }

    })

});

//update category by Id
router.put('/category/update/:id', ensureToken, (req, res) => {

    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Type.findByIdAndUpdate(req.params.id, req.body).then(function (type) {
                res.status(200).json(
                    req.body,
                );
                // res.send();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});
//get All category
router.get('/getAllcategory', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Type.find().then(function (users) {
                res.send(users)
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });


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
module.exports = router;