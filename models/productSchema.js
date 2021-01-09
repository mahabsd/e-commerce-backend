const mongoose = require('mongoose');
var schema = mongoose.Schema;
// require("../routes/userApi")

var productSchema = new schema({

    item: {
        type: String,
        required:[true,'Item is required']
    },
    price:{
        type: Number,
        required:[true,'Price is required']
    },
    quantity:{
        type: Number,
        required:[true,'Quantity is required']
    },
   
    descriptionItem: {
        type: String,
        required:[true,'Desription is required']
    },
    category:[{type:Schema.Types.ObjectId,ref:'category'}],
    userID :   [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

})

module.exports = mongoose.model("product", productSchema)