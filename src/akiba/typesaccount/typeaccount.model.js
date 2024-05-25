const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const typeAccountSchema = new schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model("typesaccounts",typeAccountSchema);