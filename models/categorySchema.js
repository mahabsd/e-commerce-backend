const mongoose = require('mongoose');
var schema = mongoose.Schema;
// require("../routes/userApi")

var categorySchema = new schema({

    name: {
        type: String,
        required:[true,'Item is required']
    },
    userID :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

})

module.exports = mongoose.model("category", categorySchema)