const express = require('express');
const router = express.Router();
const Client = require("../models/clientSchema")
const jwt = require("jsonwebtoken");

router.post('/client/add', ensureToken, (req, res) => {

    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {
            console.log(err);
            res.status(403)

        } else {
            var client = new Client(req.body);
            client.save().then(function () {
                console.log(client);
                res.json(client);
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});

//get client by ID
router.get('/client/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {

            Client.findById(req.params.id).populate('userClient').exec().then(data => {
                res.send(data);
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});

//update client by ID
router.put('/client/update/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Client.findByIdAndUpdate(req.params.id, req.body).then(function () {
                res.send(req.body);
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

})

//delete client by ID
router.delete('/client/delete/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Client.findByIdAndDelete(req.params.id, req.body).then(() => {
                res.send("client deleted successfully");
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

})
//get All client by ID
router.get('/getAllClients', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Client.find().populate('userClient').exec().then(function (client) {
                res.send(client)
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});

//affect id user for every client 
router.put('/affectuserClient/:idUser/:idClient',ensureToken, (req, res) => {

    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {
            res.status(403)
            console.log( err);

        }else{
            Client.findByIdAndUpdate(req.params.idClient, {
                $push: {
                    userClient: req.params.idUser
                }
            }).then((client) => {
                res.status(200).json(client);
        
            }).catch(err => res.status(400).json('Error: ' + err));
        }

    });
    
   
});
//splice  id user for every client 
router.delete('/deleteuserClient/:idUser/:idClient', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Client.findByIdAndUpdate(req.params.idClient, {
                $pull: {
                    userClient: req.params.idUser
                }
            }).then((client) => {
                res.status(200).json(client);
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