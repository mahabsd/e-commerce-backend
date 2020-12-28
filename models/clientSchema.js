const mongoose = require('mongoose');
var schema = mongoose.Schema;
// require("../routes/userApi")

var clientSchema = new schema({
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
    userClient :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    favourite: false,
})

module.exports = mongoose.model("client", clientSchema)