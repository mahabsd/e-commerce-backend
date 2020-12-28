const express = require('express');
const router = express.Router();
const Fournisseur = require("../models/fournisseur")
const jwt = require("jsonwebtoken");

router.post('/fournisseur/add', ensureToken, (req, res) => {

    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {
            console.log(err);
            res.status(403)

        } else {
            var fournisseur = new Fournisseur(req.body);
            fournisseur.save().then(function () {
                console.log(fournisseur);
                res.json(fournisseur);
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});

//get fournisseur by ID
router.get('/fournisseur/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {

            Fournisseur.findById(req.params.id).populate('userClient').exec().then(data => {
                res.send(data);
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});

//update fournisseur by ID
router.put('/fournisseur/update/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Fournisseur.findByIdAndUpdate(req.params.id, req.body).then(function () {
                res.send(req.body);
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

})

//delete fournisseur by ID
router.delete('/fournisseur/delete/:id', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Fournisseur.findByIdAndDelete(req.params.id, req.body).then(() => {
                res.send("fournisseur deleted successfully");
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

})
//get All fournisseur by ID
router.get('/getAllFournisseurs', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Fournisseur.find().populate('userClient').exec().then(function (fournisseur) {
                res.send(fournisseur)
                res.status(200).json();
            }).catch(err => res.status(400).json('Error: ' + err));
        }
    });

});

//affect id user for every fournisseur 
router.put('/affectuserClient/:idUser/:idFournisseurs',ensureToken, (req, res) => {

    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {
            res.status(403)
            console.log( err);

        }else{
            Fournisseur.findByIdAndUpdate(req.params.idClient, {
                $push: {
                    userFournisseur: req.params.idUser
                }
            }).then((fournisseur) => {
                res.status(200).json(fournisseur);
        
            }).catch(err => res.status(400).json('Error: ' + err));
        }

    });
    
   
});
//splice  id user for every fournisseur 
router.delete('/deleteuserClient/:idUser/:idFournisseur', ensureToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err) => {
        if (err) {

            res.status(403)

        } else {
            Fournisseur.findByIdAndUpdate(req.params.idFournisseur, {
                $pull: {
                    userFournisseur: req.params.idUser
                }
            }).then((fournisseur) => {
                res.status(200).json(fournisseur);
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