const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const natureAccountSchema = new schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    isgroup:{
        type:Boolean,
        required:true,
        default:false
    },
    typetransaction:{
        type:String,
        required:true,
        default:"single"
    },
    isclosed:{
        type:Boolean,
        required:true,
        default:false
    }
});

module.exports = mongoose.model("accountnatures",natureAccountSchema);