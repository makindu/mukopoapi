const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const moneySchema = new schema({
    name:{
        type: String,
        required :true,
        unique:true
    },
    abreviation:{
        type:String,
        unique:true,
        required:true
    }
});

module.exports = mongoose.model("moneys",moneySchema);