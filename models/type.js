const mongoose = require('mongoose');
var schema = mongoose.Schema;
// require("../routes/userApi")

var typeSchema = new schema({

    type: [],
    userID :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

})

module.exports = mongoose.model("type", typeSchema)