const mongoose = require('mongoose');
var schema = mongoose.Schema;


var fournisseurSchema = new schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    type: {
        type: String
    },
    userFournisseur :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],


})

module.exports = mongoose.model("fournisseur", fournisseurSchema)