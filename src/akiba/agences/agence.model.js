const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const agencySchema = new schema({
    name:{
        type: String,
        required :true,
        unique:true
    }, 
    description:{
        type: String,
        required :false,
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    town:{
        type:String,
        required:false
    },
    province:{
        type:String,
        required:false
    },
    country:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model("agencies",agencySchema);